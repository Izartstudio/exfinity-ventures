import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type FormSubmission = {
  formType?: "newsletter" | "research";
  name?: string;
  email?: string;
  company?: string;
  companyWebsite?: string;
  page?: string;
};

const attempts = new Map<string, { count: number; resetAt: number }>();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isRateLimited(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwardedFor || "unknown";
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  current.count += 1;
  return current.count > 8;
}

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json({ error: "Too many submissions. Please try again shortly." }, { status: 429 });
  }

  const webhookUrl = process.env.WEB_APP_URL;
  const webhookSecret = process.env.WEBHOOK_SECRET;
  if (!webhookUrl || !webhookSecret) {
    console.error("Form webhook is not configured.");
    return NextResponse.json({ error: "Form submissions are temporarily unavailable." }, { status: 503 });
  }

  let body: FormSubmission;
  try {
    body = await request.json() as FormSubmission;
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid body");
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  // Do not acknowledge a sheet write for submissions that are not forwarded.
  if (clean(body.companyWebsite, 200)) return NextResponse.json({ ok: false });

  const formType = body.formType;
  const name = clean(body.name, 100);
  const email = clean(body.email, 254).toLowerCase();
  const company = clean(body.company, 150);
  const page = clean(body.page, 500);

  if ((formType !== "newsletter" && formType !== "research") || !emailPattern.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (formType === "research" && (name.length < 2 || company.length < 2)) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  const action = formType === "research" ? "thesis" : "newsletter";
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: webhookSecret,
        action,
        name,
        email,
        company,
        source: formType === "newsletter" ? "footer" : "research-modal",
        page,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(45_000),
    });

    const result = await response.json().catch(() => null) as { ok?: boolean; error?: unknown; action?: string; redirectUrl?: string } | null;
    const validationMessages: Record<string, string> = {
      NAME_REQUIRED: "Please enter your full name (at least 2 characters).",
      COMPANY_REQUIRED: "Please enter your company or institution (at least 2 characters).",
      INVALID_EMAIL: "Please enter a valid email address.",
      BUSINESS_EMAIL_REQUIRED: "Please use your business or academic email address to access the report.",
    };
    if (result?.ok === false && typeof result.error === "string" && validationMessages[result.error]) {
      return NextResponse.json({ ok: false, error: validationMessages[result.error] }, { status: 400 });
    }
    if (!response.ok || result?.ok !== true || result.action !== action) {
      // Preserve safe upstream error codes in server logs, without logging PII or secrets.
      const code = typeof result?.error === "string" && /^[A-Z_]{1,64}$/.test(result.error)
        ? result.error
        : "UNCONFIRMED_SUBMISSION";
      throw new Error(`Webhook returned ${response.status}: ${code}`);
    }
    // Both Apps Script handlers acknowledge success only after the sheet write.
    let reportUrl: string | undefined;
    if (action === "thesis") {
      const report = new URL(result.redirectUrl || "");
      if (report.protocol !== "https:" || report.hostname !== "docsend.com" || report.username || report.password) {
        throw new Error("Invalid report URL in webhook response");
      }
      reportUrl = report.href;
    }
    return NextResponse.json({ ok: true, reportUrl });
  } catch (error) {
    console.error("Unable to submit website form.", error);
    return NextResponse.json({ error: "We couldn't submit the form. Please try again." }, { status: 502 });
  }
}
