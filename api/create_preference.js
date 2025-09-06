// /api/create_preference.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
        const fetch = (await import('node-fetch')).default;
        const url = 'https://api.mercadopago.com/preapproval';
        
        // ID de tu Plan de PRODUCCIÓN
        const planId = 'de7fad4ab7ad4147b0588a9a775c2f99'; 
        
        // Access Token de PRODUCCIÓN (desde Vercel)
        const accessToken = process.env.MP_ACCESS_TOKEN;

        if (!accessToken) {
            return res.status(500).json({ error: 'Error de configuración: MP_ACCESS_TOKEN no está configurado en Vercel.' });
        }

        const body = {
            preapproval_plan_id: planId,
            reason: 'Suscripción EvolutionGlute App',
            back_urls: { 
                success: 'https://nueva-gules.vercel.app/', 
                failure: 'https://nueva-gules.vercel.app/',
                pending: 'https://nueva-gules.vercel.app/'
            },
            auto_recurring: { frequency: 1, frequency_type: 'months' }
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
        
        return res.status(200).json({ id: data.id });
    } catch (error) {
        return res.status(500).json({ error: 'Error interno de la API', details: error.message });
    }
}