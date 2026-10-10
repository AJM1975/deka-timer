import { handleData } from './data-api.mjs';
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') {
      return Response.json({ ok: true, service: 'racesplit', environment: env.ENVIRONMENT || 'unknown' }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }
    if (url.pathname === '/api/storage/health') {
      if (!env.DB) return Response.json({ ok: false, database: 'unbound' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
      try {
        const row = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users'").first();
        return Response.json({ ok: !!row, database: row ? 'ready' : 'migration-required' }, { status: row ? 200 : 503, headers: { 'Cache-Control': 'no-store' } });
      } catch {
        return Response.json({ ok: false, database: 'unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
      }
    }
    if (url.pathname === '/api/me' || url.pathname.startsWith('/api/athletes') || url.pathname.startsWith('/api/races')) return handleData(request, env, url);
    if (url.pathname.startsWith('/api/')) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    return env.ASSETS.fetch(request);
  }
};
