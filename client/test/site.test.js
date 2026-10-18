import test from 'node:test';
import assert from 'node:assert/strict';
import { createSiteConfig, externalUrl, assetUrl } from '../src/config/site.js';
import { readFile } from 'node:fs/promises';
test('optional configuration never creates empty or placeholder links', () => {
  const site = createSiteConfig({});
  assert.equal(site.emailHref, null);
  assert.equal(site.phoneHref, null);
  assert.ok(Object.values(site.social).every(value => value === null));
  assert.equal(site.cvUrl, '/CV.pdf');
  assert.equal(createSiteConfig({ VITE_CV_URL: '' }).cvUrl, null);
  assert.equal(site.apiUrl, '');
});
test('configured identity, email, phone and social values are trimmed', () => {
  const site = createSiteConfig({ VITE_PORTFOLIO_NAME: ' Test Developer ', VITE_CONTACT_EMAIL: ' hello@example.test ', VITE_CONTACT_PHONE: '+1 (555) 123-4567', VITE_GITHUB_URL: ' https://github.com/test ', VITE_CV_URL: '/CV.pdf', BASE_URL: '/portfolio/' });
  assert.equal(site.name, 'Test Developer');
  assert.equal(site.emailHref, 'mailto:hello@example.test');
  assert.equal(site.phoneHref, 'tel:+15551234567');
  assert.equal(site.social.github, 'https://github.com/test');
  assert.equal(site.cvUrl, '/portfolio/CV.pdf');
});
test('unsafe URLs, credential URLs and malformed contact values are hidden', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,x', '//evil.test', 'https://user:pass@example.test', '#', 'https:/example.test']) assert.equal(externalUrl(value), null);
  for (const value of ['//evil.test/a', '/\\evil.test/a', '/path with spaces']) assert.equal(assetUrl(value), null);
  const site = createSiteConfig({ VITE_CONTACT_EMAIL: 'bad?subject=x@example.test', VITE_CONTACT_PHONE: 'call me', VITE_LINKEDIN_URL: 'javascript:alert(1)' });
  assert.equal(site.emailHref, null); assert.equal(site.phoneHref, null); assert.equal(site.social.linkedin, null);
});
test('the production CV exists with the correct capitalization and PDF signature', async () => {
  const bytes = await readFile(new URL('../public/CV.pdf', import.meta.url));
  assert.equal(bytes.subarray(0,5).toString(), '%PDF-');
});

test('API and canonical origins reject paths, queries and fragments',()=>{
  for(const value of ['https://example.test/api','https://example.test?key=value','https://example.test#fragment']) {
    const site=createSiteConfig({VITE_API_URL:value,VITE_SITE_URL:value});
    assert.equal(site.apiUrl,''); assert.equal(site.siteUrl,null);
  }
  assert.equal(createSiteConfig({VITE_API_URL:'https://example.test/'}).apiUrl,'https://example.test');
});
