import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = ts.transpileModule(readFileSync(new URL('../app/api/forms/route.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function handler(reply) {
  let sent;
  const context = { exports: {}, require: () => ({ NextResponse: { json: (body, init) => Response.json(body, init) } }), process: { env: { WEB_APP_URL: 'https://example.com/webhook', WEBHOOK_SECRET: 'test-secret' } }, console: { error() {} }, URL, AbortSignal, fetch: async (_, options) => { sent = JSON.parse(options.body); return Response.json(reply); } };
  vm.runInNewContext(source, context);
  return { post: context.exports.POST, sent: () => sent };
}
const request = (formType = 'research', email = 'reader@company.example') => new Request('https://example.com/api/forms', { method: 'POST', body: JSON.stringify({ formType, name: 'Test Reader', email, company: 'Test Company' }) });

test('thesis sends expected action and exposes returned report only on saved acknowledgement', async () => {
  const h = handler({ ok: true, action: 'thesis', redirectUrl: 'https://docsend.com/view/mejypwt6ksnq2hai', teamNotificationSent: false });
  const response = await h.post(request());
  assert.equal(h.sent().action, 'thesis');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).reportUrl, 'https://docsend.com/view/mejypwt6ksnq2hai');
});
test('personal email rejection never grants report access', async () => {
  const h = handler({ ok: false, error: 'BUSINESS_EMAIL_REQUIRED' });
  const response = await h.post(request('research', 'reader@gmail.com'));
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.ok, false);
  assert.match(body.error, /business or academic/);
  assert.equal(body.reportUrl, undefined);
});
test('newsletter accepts personal emails when script confirms save', async () => {
  const h = handler({ ok: true, action: 'newsletter', alreadySubscribed: true });
  const response = await h.post(request('newsletter', 'reader@gmail.com'));
  assert.equal(h.sent().action, 'newsletter');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
});
for (const reply of [{ ok: false, error: 'SERVER_ERROR' }, { ok: true }, { ok: true, action: 'newsletter' }, { ok: true, action: 'thesis', redirectUrl: 'https://example.com/report' }]) {
  test(`unconfirmed or invalid acknowledgement fails closed: ${JSON.stringify(reply)}`, async () => {
    const response = await handler(reply).post(request());
    assert.equal(response.status, 502);
    assert.equal((await response.json()).reportUrl, undefined);
  });
}
