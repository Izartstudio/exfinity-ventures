import { NextResponse } from "next/server";

export const runtime = "nodejs";

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
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  // Do not acknowledge a sheet write for submissions that are not forwarded.
  if (clean(body.companyWebsite, 200)) return NextResponse.json({ ok: false });

  const formType = body.formType;
  const name = clean(body.name, 120);
  const email = clean(body.email, 254).toLowerCase();
  const company = clean(body.company, 160);
  const page = clean(body.page, 500);

  if ((formType !== "newsletter" && formType !== "research") || !emailPattern.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (formType === "research" && (!name || !company)) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: webhookSecret,
        formType,
        name,
        email,
        company,
        source: formType === "newsletter" ? "footer" : "research-modal",
        page,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    const result = await response.json().catch(() => null) as { ok?: boolean; error?: unknown } | null;
    if (!response.ok || result?.ok !== true) {
      // Preserve safe upstream error codes in server logs, without logging PII or secrets.
      const code = typeof result?.error === "string" && /^[A-Z_]{1,64}$/.test(result.error)
        ? result.error
        : "UNCONFIRMED_SUBMISSION";
      throw new Error(`Webhook returned ${response.status}: ${code}`);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unable to submit website form.", error);
    return NextResponse.json({ error: "We couldn't submit the form. Please try again." }, { status: 502 });
  }
}
