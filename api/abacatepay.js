export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const ABACATEPAY_API_KEY = process.env.ABACATEPAY_API_KEY || 'abc_dev_4JzZ4L6nk1WxQpLu0bHQHUAk';
  const PRODUCT_ID = process.env.ABACATEPAY_PRODUCT_ID || 'prod_y31fKZykxp5EbPdghWgmu5K6';

  if (req.method === 'POST') {
    try {
      const { visitorId, returnUrl } = req.body || {};
      const host = req.headers.host ? `https://${req.headers.host}` : 'https://eucarolzinha.vercel.app';
      const redirectUrl = returnUrl || host;

      const payload = {
        items: [
          {
            id: PRODUCT_ID,
            quantity: 1
          }
        ],
        methods: ['PIX'],
        returnUrl: redirectUrl,
        completionUrl: redirectUrl
      };

      const abacateRes = await fetch('https://api.abacatepay.com/v2/checkouts/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ABACATEPAY_API_KEY.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await abacateRes.json();
      if (!abacateRes.ok || !data.success) {
        return res.status(abacateRes.status || 500).json({
          success: false,
          error: data.error || 'Erro ao gerar checkout na AbacatePay'
        });
      }

      return res.status(200).json({
        success: true,
        checkoutId: data.data.id,
        checkoutUrl: data.data.url,
        amount: (data.data.amount || 990) / 100,
        status: data.data.status
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message || 'Erro interno no servidor'
      });
    }
  }

  // GET: Consulta status do checkout
  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Parâmetro id é obrigatório' });
    }

    try {
      const abacateRes = await fetch(`https://api.abacatepay.com/v2/checkouts/get?id=${encodeURIComponent(id)}`, {
        headers: {
          'Authorization': `Bearer ${ABACATEPAY_API_KEY.trim()}`
        }
      });
      const data = await abacateRes.json();

      if (!abacateRes.ok || !data.success) {
        return res.status(abacateRes.status || 404).json({
          success: false,
          error: data.error || 'Checkout não encontrado'
        });
      }

      const status = data.data.status;
      const isPaid = status === 'PAID' || status === 'COMPLETED';

      return res.status(200).json({
        success: true,
        id: data.data.id,
        status,
        isPaid,
        amount: (data.data.amount || 990) / 100,
        checkoutUrl: data.data.url
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message || 'Erro ao consultar status'
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
