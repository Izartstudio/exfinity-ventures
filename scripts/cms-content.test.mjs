import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

function cms() {
  const root = resolve(import.meta.dirname, '..');
  const documents = {};
  const requests = [];
  const modules = new Map();
  const state = { fail: false };
  const sentinel = new Error('Next render control flow');
  function load(file) {
    file = extname(file) ? file : `${file}.ts`;
    if (file.endsWith('.json')) return JSON.parse(readFileSync(file, 'utf8'));
    if (modules.has(file)) return modules.get(file);
    const exports = {};
    modules.set(file, exports);
    const source = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    vm.runInNewContext(source, {
      exports, URL, AbortSignal, console: { error() {} },
      process: { env: { NEXT_PUBLIC_SANITY_PROJECT_ID: 'test', NEXT_PUBLIC_SANITY_DATASET: 'production' } },
      require: (name) => name === 'next/navigation' ? { unstable_rethrow: (error) => { if (error === sentinel) throw error; } } : load(name.startsWith('@/') ? resolve(root, name.slice(2)) : resolve(dirname(file), name)),
      fetch: async (url, options) => {
        requests.push({ url: new URL(url), options });
        if (state.fail === 'next') throw sentinel;
        if (state.fail) throw new Error('CMS outage');
        const type = new URL(url).searchParams.get('query').match(/_type == "([^"]+)"/)[1];
        return Response.json({ result: documents[type] ?? null });
      },
    });
    return exports;
  }
  return { documents, requests, state, sentinel, load: (name) => load(resolve(root, `lib/sanity/${name}.ts`)) };
}

test('published edits are fetched again without CDN or server caching', async () => {
  const h = cms();
  const api = h.load('homepage');
  h.documents.homepageStats = { stats: [{ value: '41', label: 'Companies' }] };
  assert.equal((await api.getHomepageStats())[0].value, '41');
  h.documents.homepageStats.stats[0].value = '42';
  assert.equal((await api.getHomepageStats())[0].value, '42');
  for (const request of h.requests) {
    assert.equal(request.options.cache, 'no-store');
    assert.equal(request.url.searchParams.get('perspective'), 'published');
    assert.match(request.url.searchParams.get('query'), /order\(_updatedAt desc\)/);
    assert.ok(request.options.signal);
  }
});

test('missing sections and network failures use complete local fallback', async () => {
  const h = cms();
  const api = h.load('portfolio');
  const expected = await api.getPortfolioWall();
  assert.ok(expected.companies.length > 20);
  h.state.fail = true;
  assert.deepEqual(await api.getPortfolioWall(), expected);
});

test('Next rendering control-flow errors are rethrown', async () => {
  const h = cms();
  h.state.fail = 'next';
  await assert.rejects(h.load('homepage').getHomepageStats(), (error) => error === h.sentinel);
});

test('empty CMS collections do not resurrect local content', async () => {
  const h = cms();
  h.documents.portfolioPage = { companies: [] };
  h.documents.teamPage = { partners: [], founders: [], investmentTeam: [], tacTeam: [] };
  h.documents.homepageCompanies = { companies: [] };
  h.documents.homepageBacking = { cards: [] };
  h.documents.homepageFounders = { founders: [] };
  h.documents.homepageStats = { stats: [] };
  h.documents.contactFaqs = { faqs: [] };
  assert.equal((await h.load('portfolio').getPortfolioWall()).companies.length, 0);
  assert.equal((await h.load('team').getTeamPage()).partners.length, 0);
  assert.equal((await h.load('sections').getHomepageCompanies()).companies.length, 0);
  assert.equal((await h.load('sections').getHomepageBacking()).cards.length, 0);
  assert.equal((await h.load('homepage').getHomepageFounders()).founders.length, 0);
  assert.equal((await h.load('homepage').getHomepageStats()).length, 0);
  assert.equal((await h.load('contact').getContactFaqs()).faqs.length, 0);
});

test('portfolio sector, deleted Aarna, and cleared optional fields respect CMS', async () => {
  const h = cms();
  h.documents.portfolioPage = { companies: [{ id: 'locus', name: 'Locus', sector: 'New sector', status: 'Active', fund: null }] };
  const { companies } = await h.load('portfolio').getPortfolioWall();
  assert.equal(companies.length, 1);
  assert.equal(companies[0].sector, 'New sector');
  assert.equal(companies[0].fund, null);
});

test('hidden members disappear from every tab and direct profile; unhide restores', async () => {
  const h = cms();
  const member = { name: 'Rahul Sasi', slug: 'custom-slug', role: 'Advisor', image: '/portrait.jpg', hideFromTeamPage: true };
  h.documents.teamPage = { partners: [member], founders: [member], investmentTeam: [member], tacTeam: [member] };
  const api = h.load('team');
  const page = await api.getTeamPage();
  for (const group of ['partners', 'founders', 'investmentTeam', 'tacTeam']) assert.equal(page[group].length, 0);
  assert.equal(await api.getTeamMember('custom-slug'), undefined);
  member.hideFromTeamPage = false;
  assert.equal((await api.getTeamMember('custom-slug')).name, 'Rahul Sasi');
});

test('new founder logos override legacy Pixis and MoEngage assets', async () => {
  const h = cms();
  h.documents.homepageFounders = { founders: ['Shubham Mishra', 'Raviteja Dodda'].map(name => ({ name, role: 'CEO', quote: 'Quote', imageUrl: '/image.png', logoUrl: 'https://cdn.sanity.io/new-logo.png' })) };
  for (const founder of (await h.load('homepage').getHomepageFounders()).founders) assert.equal(founder.logoUrl, 'https://cdn.sanity.io/new-logo.png');
});

test('invalid entries are omitted without replacing valid CMS entries with defaults', async () => {
  const h = cms();
  h.documents.portfolioPage = { companies: [{ name: 'Incomplete' }, { name: 'Valid', id: 'valid', sector: 'New', status: 'Active' }] };
  const { companies } = await h.load('portfolio').getPortfolioWall();
  assert.equal(companies.length, 1);
  assert.equal(companies[0].id, 'valid');
});
