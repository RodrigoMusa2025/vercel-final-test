// /api/create_preference.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const fetch = (await import('node-fetch')).default;
        // 1. CAMBIAMOS LA URL A LA CORRECTA PARA CHECKOUT PRO
        const url = 'https://api.mercadopago.com/checkout/preferences';
        
        const accessToken = process.env.MP_ACCESS_TOKEN;

        if (!accessToken) {
            return res.status(500).json({ error: 'Error de configuración: falta el Access Token.' });
        }

        // 2. AJUSTAMOS EL CUERPO PARA CREAR UNA PREFERENCIA DE PAGO
        const body = {
            items: [
                {
                    title: 'Suscripción Mensual EvolutionGlute',
                    quantity: 1,
                    unit_price: 100, // Reemplaza con el precio real de tu plan
                    currency_id: 'ARS' // O la moneda que corresponda
                }
            ],
            back_urls: { 
                success: 'https://nueva-gules.vercel.app/', 
                failure: 'https://nueva-gules.vercel.app/',
                pending: 'https://nueva-gules.vercel.app/'
            },
            // 3. ESTA LÍNEA VINCULA LA PREFERENCIA CON TU PLAN DE SUSCRIPCIÓN
            preapproval_plan_id: 'de7fad4ab7ad4147b0588a9a775c2f99'
        };

        const options = {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };

        const mpResponse = await fetch(url, options);
        const data = await mpResponse.json();

        if (!mpResponse.ok) {
            return res.status(mpResponse.status).json({ error: 'Error devuelto por Mercado Pago', details: data });
        }
        
        // Devolvemos el ID de la preferencia, no de la suscripción directamente
        return res.status(200).json({ id: data.id });

    } catch (error) {
        return res.status(500).json({ error: 'Error interno de la API', details: error.message });
    }
}