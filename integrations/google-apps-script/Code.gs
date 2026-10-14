const CONFIG = Object.freeze({
  THESIS_SHEET: "Thesis Access",
  NEWSLETTER_SHEET: "Newsletter Subscribers",
  NOTIFICATION_EMAIL: "website@exfinityventures.com",
  UPDATES_EMAIL: "updates@exfinityventures.com",
  DOCSEND_URL: "https://docsend.com/view/mejypwt6ksnq2hai",
  SENDER_NAME: "Exfinity Venture Partners",
});

/**
 * Common personal/free email services.
 *
 * Academic domains such as university.edu, university.ac.in and custom
 * institutional domains are allowed because they do not appear here.
 *
 * Custom company domains hosted through Google Workspace or Microsoft 365
 * are also allowed because their email domain is the company's domain,
 * not gmail.com or outlook.com.
 */
const PERSONAL_EMAIL_DOMAINS = Object.freeze([
  "gmail.com",
  "googlemail.com",

  "yahoo.com",
  "yahoo.co.in",
  "yahoo.co.uk",
  "ymail.com",
  "rocketmail.com",

  "outlook.com",
  "outlook.in",
  "hotmail.com",
  "hotmail.co.in",
  "hotmail.co.uk",
  "live.com",
  "live.in",
  "msn.com",

  "icloud.com",
  "me.com",
  "mac.com",

  "aol.com",
  "proton.me",
  "protonmail.com",
  "pm.me",

  "gmx.com",
  "gmx.net",
  "mail.com",
  "fastmail.com",
  "hey.com",
  "zoho.com",
  "zohomail.com",

  "rediffmail.com",
  "rediff.com",
  "in.com",

  "yandex.com",
  "yandex.ru",

  "tutanota.com",
  "tuta.com",
  "mailfence.com",

  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "guerrillamail.com",
  "guerrillamailblock.com",
  "mailinator.com",
  "yopmail.com",
  "sharklasers.com",
  "throwawaymail.com",
]);

const THESIS_HEADERS = Object.freeze([
  "Timestamp",
  "Name",
  "Email",
  "Company / Institution",
  "Email Domain",
  "Source",
  "Team Notification Sent",
]);

const NEWSLETTER_HEADERS = Object.freeze([
  "Timestamp",
  "Email",
  "Email Domain",
  "Source",
  "Status",
  "Welcome Email Sent",
  "Team Notification Sent",
]);

function setupSheets() {
  const settings = getSettings_();
  const spreadsheet = SpreadsheetApp.openById(settings.spreadsheetId);

  ensureSheet_(spreadsheet, CONFIG.THESIS_SHEET, THESIS_HEADERS);
  ensureSheet_(
    spreadsheet,
    CONFIG.NEWSLETTER_SHEET,
    NEWSLETTER_HEADERS
  );

  Logger.log("Both Exfinity lead sheets are ready.");
}


function doGet() {
  return jsonResponse_({
    ok: true,
    service: "Exfinity website forms",
  });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throwPublicError_("EMPTY_REQUEST");
    }

    const payload = JSON.parse(e.postData.contents);
    const settings = getSettings_();

    if (
      !payload.secret ||
      String(payload.secret) !== settings.webhookSecret
    ) {
      throwPublicError_("UNAUTHORIZED");
    }

    const action = String(payload.action || "").trim().toLowerCase();

    if (action === "thesis") {
      return jsonResponse_(
        handleThesisSubmission_(payload, settings)
      );
    }

    if (action === "newsletter") {
      return jsonResponse_(
        handleNewsletterSubmission_(payload, settings)
      );
    }

    throwPublicError_("INVALID_ACTION");
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);

    return jsonResponse_({
      ok: false,
      error: publicErrorCode_(error),
    });
  }
}

function handleThesisSubmission_(payload, settings) {
  const name = cleanText_(payload.name, 100);
  const company = cleanText_(payload.company, 150);
  const email = normalizeEmail_(payload.email);
  const source = cleanText_(
    payload.source || "Physical AI Thesis",
    100
  );

  if (name.length < 2) {
    throwPublicError_("NAME_REQUIRED");
  }

  if (company.length < 2) {
    throwPublicError_("COMPANY_REQUIRED");
  }

  if (!isValidEmail_(email)) {
    throwPublicError_("INVALID_EMAIL");
  }

  if (!isBusinessOrAcademicEmail_(email)) {
    throwPublicError_("BUSINESS_EMAIL_REQUIRED");
  }

  const domain = email.split("@")[1];
  const submittedAt = new Date();
  const spreadsheet = SpreadsheetApp.openById(
    settings.spreadsheetId
  );
  const sheet = ensureSheet_(
    spreadsheet,
    CONFIG.THESIS_SHEET,
    THESIS_HEADERS
  );

  let rowNumber;

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    sheet.appendRow([
      submittedAt,
      safeCell_(name),
      email,
      safeCell_(company),
      domain,
      safeCell_(source),
      "Pending",
    ]);

    rowNumber = sheet.getLastRow();
  } finally {
    lock.releaseLock();
  }

  const formattedDate = Utilities.formatDate(
    submittedAt,
    Session.getScriptTimeZone(),
    "dd MMM yyyy, hh:mm a"
  );

  const teamNotificationSent = sendEntryNotification_({
    title: "New thesis report access",
    summary: "A visitor submitted their details to access the Physical AI Thesis. Their entry has been saved to the sheet.",
    subject: "New thesis access — " + name,
    replyTo: email,
    spreadsheetId: settings.spreadsheetId,
    sheetId: sheet.getSheetId(),
    rowNumber: rowNumber,
    details: [
      ["Name", name],
      ["Email", email],
      ["Company / Institution", company],
      ["Email domain", domain],
      ["Source", source],
      ["Page", cleanText_(payload.page, 500) || "Not provided"],
      ["Submitted at", formattedDate + " (" + Session.getScriptTimeZone() + ")"],
      ["Sheet", CONFIG.THESIS_SHEET],
      ["Row", String(rowNumber)],
      ["Report", CONFIG.DOCSEND_URL],
    ],
  });

  sheet
    .getRange(rowNumber, 7)
    .setValue(teamNotificationSent ? "Yes" : "Failed");

  return {
    ok: true,
    action: "thesis",
    redirectUrl: CONFIG.DOCSEND_URL,
    teamNotificationSent: teamNotificationSent,
  };
}

function handleNewsletterSubmission_(payload, settings) {
  const email = normalizeEmail_(payload.email);
  const source = cleanText_(
    payload.source || "Website footer",
    100
  );

  if (!isValidEmail_(email)) {
    throwPublicError_("INVALID_EMAIL");
  }

  const domain = email.split("@")[1];
  const spreadsheet = SpreadsheetApp.openById(
    settings.spreadsheetId
  );
  const sheet = ensureSheet_(
    spreadsheet,
    CONFIG.NEWSLETTER_SHEET,
    NEWSLETTER_HEADERS
  );

  let rowNumber;
  let alreadySubscribed = false;

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const lastRow = sheet.getLastRow();

    let existingCell = null;

    if (lastRow > 1) {
      existingCell = sheet
        .getRange(2, 2, lastRow - 1, 1)
        .createTextFinder(email)
        .matchEntireCell(true)
        .matchCase(false)
        .findNext();
    }

    if (existingCell) {
      alreadySubscribed = true;
      rowNumber = existingCell.getRow();

      sheet.getRange(rowNumber, 5).setValue("Subscribed");
    } else {
      sheet.appendRow([
        new Date(),
        email,
        domain,
        safeCell_(source),
        "Subscribed",
        "Pending",
        "Pending",
      ]);

      rowNumber = sheet.getLastRow();
    }
  } finally {
    lock.releaseLock();
  }

  let welcomeEmailSent =
    String(sheet.getRange(rowNumber, 6).getValue()) === "Yes";

  let teamNotificationSent =
    String(sheet.getRange(rowNumber, 7).getValue()) === "Yes";


  if (!welcomeEmailSent) {
    welcomeEmailSent = sendMailSafely_({
      to: email,
      replyTo: CONFIG.UPDATES_EMAIL,
      name: CONFIG.SENDER_NAME,
      subject: "Welcome to Exfinity News & Insights",
      body:
        "Thank you for subscribing to Exfinity News & Insights.\n\n" +
        "You will receive our latest perspectives, portfolio updates, " +
        "research and stories from the technology ecosystem.\n\n" +
        "If you did not request this subscription, contact " +
        CONFIG.UPDATES_EMAIL + ".\n\n" +
        "Exfinity Venture Partners",
      htmlBody:
        "<div style=\"font-family:Arial,sans-serif;color:#000021;" +
        "line-height:1.6;max-width:620px\">" +
        "<h2 style=\"font-weight:500\">Welcome to Exfinity News &amp; Insights</h2>" +
        "<p>Thank you for subscribing.</p>" +
        "<p>You will receive our latest perspectives, portfolio updates, " +
        "research and stories from the technology ecosystem.</p>" +
        "<p style=\"color:#666;font-size:13px\">" +
        "If you did not request this subscription, contact " +
        "<a href=\"mailto:" + CONFIG.UPDATES_EMAIL + "\">" +
        CONFIG.UPDATES_EMAIL +
        "</a>.</p>" +
        "<p>Exfinity Venture Partners</p>" +
        "</div>",
    });

    sheet
      .getRange(rowNumber, 6)
      .setValue(welcomeEmailSent ? "Yes" : "Failed");
  }

  if (!teamNotificationSent) {
    teamNotificationSent = sendEntryNotification_({
      title: alreadySubscribed ? "Newsletter subscription confirmed" : "New newsletter subscriber",
      summary: alreadySubscribed ? "An existing subscriber confirmed their subscription. The sheet has been updated." : "A visitor subscribed to News & Insights. Their entry has been saved to the sheet.",
      subject: (alreadySubscribed ? "Newsletter subscription confirmed — " : "New newsletter subscriber — ") + email,
      replyTo: email,
      spreadsheetId: settings.spreadsheetId,
      sheetId: sheet.getSheetId(),
      rowNumber: rowNumber,
      details: [
        ["Email", email],
        ["Email domain", domain],
        ["Source", source],
        ["Page", cleanText_(payload.page, 500) || "Not provided"],
        ["Received at", Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd MMM yyyy, hh:mm a") + " (" + Session.getScriptTimeZone() + ")"],
        ["Status", "Subscribed"],
        ["Existing subscriber", alreadySubscribed ? "Yes" : "No"],
        ["Welcome email sent", welcomeEmailSent ? "Yes" : "Failed"],
        ["Sheet", CONFIG.NEWSLETTER_SHEET],
        ["Row", String(rowNumber)],
      ],
    });

    sheet
      .getRange(rowNumber, 7)
      .setValue(teamNotificationSent ? "Yes" : "Failed");
  }

  return {
    ok: true,
    action: "newsletter",
    alreadySubscribed: alreadySubscribed,
    welcomeEmailSent: welcomeEmailSent,
    teamNotificationSent: teamNotificationSent,
  };
}

function getSettings_() {
  const properties =
    PropertiesService.getScriptProperties();

  const spreadsheetId =
    properties.getProperty("SPREADSHEET_ID");

  const webhookSecret =
    properties.getProperty("WEBHOOK_SECRET");

  if (!spreadsheetId) {
    throw new Error(
      "Missing SPREADSHEET_ID in Script Properties."
    );
  }

  if (!webhookSecret) {
    throw new Error(
      "Missing WEBHOOK_SECRET in Script Properties."
    );
  }

  return {
    spreadsheetId: spreadsheetId,
    webhookSecret: webhookSecret,
  };
}

function ensureSheet_(spreadsheet, sheetName, headers) {
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    sheet
      .getRange(1, 1, 1, headers.length)
      .setValues([headers])
      .setFontWeight("bold");

    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }

  return sheet;
}

function normalizeEmail_(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function isValidEmail_(email) {
  if (!email || email.length > 254) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function isBusinessOrAcademicEmail_(email) {
  if (!isValidEmail_(email)) {
    return false;
  }

  const domain = email.split("@")[1].toLowerCase();

  return !PERSONAL_EMAIL_DOMAINS.some(function (blockedDomain) {
    return (
      domain === blockedDomain ||
      domain.endsWith("." + blockedDomain)
    );
  });
}

function cleanText_(value, maximumLength) {
  return String(value || "")
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, maximumLength);
}


function safeCell_(value) {
  const text = String(value || "");

  if (/^[=+\-@]/.test(text)) {
    return "'" + text;
  }

  return text;
}

function escapeHtml_(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sendMailSafely_(mailOptions) {
  try {
    MailApp.sendEmail(mailOptions);
    return true;
  } catch (error) {
    console.error(
      "Email sending failed: " +
      (error && error.message ? error.message : error)
    );
    return false;
  }
}

function throwPublicError_(code) {
  throw new Error(code);
}

function publicErrorCode_(error) {
  const allowedErrors = [
    "EMPTY_REQUEST",
    "UNAUTHORIZED",
    "INVALID_ACTION",
    "NAME_REQUIRED",
    "COMPANY_REQUIRED",
    "INVALID_EMAIL",
    "BUSINESS_EMAIL_REQUIRED",
  ];

  const message =
    error && error.message ? String(error.message) : "";

  return allowedErrors.indexOf(message) !== -1
    ? message
    : "SERVER_ERROR";
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Send a readable HTML notification, with a plain-text alternative. */
function sendEntryNotification_(entry) {
  const sheetUrl = "https://docs.google.com/spreadsheets/d/" + encodeURIComponent(entry.spreadsheetId) +
    "/edit#gid=" + encodeURIComponent(entry.sheetId) + "&range=A" + entry.rowNumber + ":G" + entry.rowNumber;
  const rows = entry.details.map(function (detail, index) {
    return '<tr style="background:' + (index % 2 ? '#ffffff' : '#f5f8ff') + '">' +
      '<td style="padding:12px 16px;width:35%;vertical-align:top;color:#526078;font-size:13px;border-bottom:1px solid #e4eaf3">' + escapeHtml_(detail[0]) + '</td>' +
      '<td style="padding:12px 16px;vertical-align:top;color:#101c35;font-size:14px;border-bottom:1px solid #e4eaf3;word-break:break-word">' + escapeHtml_(detail[1]) + '</td></tr>';
  }).join("");
  return sendMailSafely_({
    to: CONFIG.NOTIFICATION_EMAIL,
    replyTo: entry.replyTo,
    name: CONFIG.SENDER_NAME,
    subject: entry.subject,
    body: entry.title + "\n\n" + entry.summary + "\n\n" + entry.details.map(function (detail) {
      return detail[0] + ": " + detail[1];
    }).join("\n") + "\n\nView saved entry: " + sheetUrl,
    htmlBody: '<div style="background:#f3f6fc;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;line-height:1.5">' +
      '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;margin:0 auto;background:#fff;border:1px solid #e0e6f0;border-radius:8px;overflow:hidden">' +
      '<tr><td style="padding:28px;background:#000021;color:#fff"><p style="margin:0 0 14px;font-size:11px;letter-spacing:3px;color:#a8c6ff">EXFINITY VENTURE PARTNERS</p>' +
      '<h1 style="margin:0;font-size:24px;line-height:1.3;font-weight:500">' + escapeHtml_(entry.title) + '</h1></td></tr>' +
      '<tr><td style="padding:24px 28px"><p style="margin:0 0 20px;color:#526078;font-size:14px">' + escapeHtml_(entry.summary) + '</p>' +
      '<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">' + rows + '</table>' +
      '<p style="margin:28px 0 8px"><a href="' + escapeHtml_(sheetUrl) + '" style="display:inline-block;background:#004de5;color:#fff;padding:12px 20px;text-decoration:none;border-radius:4px;font-size:14px">View saved entry</a></p>' +
      '<p style="margin:18px 0 0;color:#6b7280;font-size:12px">Reply to this email to contact the visitor. Sent automatically by the Exfinity website.</p>' +
      '</td></tr></table></div>',
  });
}
