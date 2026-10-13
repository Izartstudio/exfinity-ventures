import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const code = readFileSync(new URL('../integrations/google-apps-script/Code.gs', import.meta.url), 'utf8');
const entry = { title: 'New thesis report access', summary: 'Entry saved.', subject: 'New thesis access', replyTo: 'visitor@company.example', spreadsheetId: 'sheet-id', sheetId: 42, rowNumber: 7, endColumn: 'H', details: [['Name', '<script>bad</script>'], ['Email', 'visitor@company.example'], ['Company', 'Company & Co.']] };
test('notification routes to website inbox with escaped details, row link and reply-to', () => {
  let sent;
  const context = vm.createContext({ MailApp: { sendEmail: (mail) => { sent = mail; } }, console });
  vm.runInContext(code, context);
  assert.equal(context.sendEntryNotification_(entry), true);
  assert.equal(sent.to, 'website@exfinityventures.com');
  assert.equal(sent.replyTo, entry.replyTo);
  assert.match(sent.htmlBody, /&lt;script&gt;bad&lt;\/script&gt;/);
  assert.match(sent.htmlBody, /Company &amp; Co\./);
  assert.match(sent.body, /range=A7:H7/);
  assert.match(sent.htmlBody, /View saved entry/);
});
test('email failures return false so sheet notification status can show Failed', () => {
  const context = vm.createContext({ MailApp: { sendEmail: () => { throw new Error('quota'); } }, console: { error() {} } });
  vm.runInContext(code, context);
  assert.equal(context.sendEntryNotification_(entry), false);
});
test('thesis personal email block remains intact', () => {
  const context = vm.createContext({ console });
  vm.runInContext(code, context);
  assert.equal(context.isBusinessOrAcademicEmail_('person@gmail.com'), false);
  assert.equal(context.isBusinessOrAcademicEmail_('person@company.example'), true);
  assert.equal(context.isBusinessOrAcademicEmail_('person@university.edu'), true);
});

test('visitor email is branded, escaped and includes the report link', () => {
  let sent;
  const context = vm.createContext({ MailApp: { sendEmail: (mail) => { sent = mail; } }, console });
  vm.runInContext(code, context);
  const delivered = context.sendVisitorEmail_({
    to: 'reader@company.example',
    subject: 'Your report',
    eyebrow: 'EXFINITY RESEARCH',
    title: 'Your report is ready',
    greeting: 'Hello <Reader>,',
    paragraphs: ['Thank you & welcome.'],
    buttonLabel: 'Download the full report',
    buttonUrl: 'https://docsend.com/view/report',
    footer: 'Requested for reader@company.example.',
  });
  assert.equal(delivered, true);
  assert.equal(sent.to, 'reader@company.example');
  assert.equal(sent.replyTo, 'updates@exfinityventures.com');
  assert.match(sent.htmlBody, /Hello &lt;Reader&gt;/);
  assert.match(sent.htmlBody, /Thank you &amp; welcome/);
  assert.match(sent.htmlBody, /https:\/\/docsend\.com\/view\/report/);
  assert.match(sent.htmlBody, /Download the full report/);
});
