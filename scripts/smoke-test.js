// Lightweight smoke-test using fetch for clearer I/O
;(async function run() {
  const host = process.env.HOST || 'http://localhost'
  const port = process.env.PORT || '3002'
  const base = `${host}:${port}`

  const endpoints = [
    { method: 'POST', path: '/api/requests', body: { itemName: 'SmokeTest', quantity: 1 } },
    { method: 'POST', path: '/api/bulk-requests', body: { itemName: 'SmokeTest', quantity: 1 } },
    { method: 'POST', path: '/api/cooperatives/register', body: { name: 'Smoke Coop' } },
    { method: 'GET', path: '/api/cooperatives/pending' },
    { method: 'POST', path: '/api/cooperatives/approve', body: { coopId: 'fake', action: 'approve' } },
  ]

  for (const ep of endpoints) {
    const url = base + ep.path
    console.log(`\n-> ${ep.method} ${ep.path}`)
    try {
      const res = await fetch(url, {
        method: ep.method,
        headers: { 'Content-Type': 'application/json' },
        body: ep.body ? JSON.stringify(ep.body) : undefined,
      })

      const text = await res.text().catch(() => '')
      console.log('STATUS:', res.status)
      console.log('BODY:', text || '<empty>')
    } catch (err) {
      console.log('ERROR:', err && err.message ? err.message : String(err))
    }
  }
})().catch((e) => console.error('Unhandled', e))
