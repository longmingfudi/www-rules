import fetch from 'node-fetch';

export default async function handler(req, res) {
  const upstream = 'https://emby.nebula-media.org';
  const targetUrl = upstream + req.url;

  try {
    const headers = { ...req.headers };
    headers['host'] = 'emby.nebula-media.org';
    headers['referer'] = upstream + '/';
    headers['origin'] = upstream;
    headers['user-agent'] = headers['user-agent'] || 'Mozilla/5.0';

    const upstreamRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req.body,
      redirect: 'manual',
    });

    res.status(upstreamRes.status);
    upstreamRes.headers.forEach((v, k) => res.setHeader(k, v));

    if (upstreamRes.body) {
      upstreamRes.body.pipe(res);
    } else {
      res.end();
    }
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(502).send('Bad Gateway');
  }
}
