// /api/create_preference.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Usamos la librería node-fetch que ya está instalada
        const fetch = (await import('node-fetch')).default;
        const url = 'https://api.mercadopago.com/preapproval';
        
        // El ID de tu plan de PRUEBA
        const planId = 'adabf5996b244b6aa181e7df9447f'; 
        
        // La clave secreta de PRUEBA desde Vercel
        const accessToken = process.env.MP_ACCESS_TOKEN_TEST;

        if (!accessToken) {
            return res.status(500).json({ error: 'Error de configuración: falta el token de acceso.' });
        }

        const body = {
            preapproval_plan_id: planId,
            reason: 'Suscripción de Prueba Final',
            back_urls: {
                success: 'https://www.google.com?status=success',
                failure: 'https://www.google.com?status=failure',
                pending: 'https://www.google.com?status=pending'
            },
            auto_recurring: {
                frequency: 1,
                frequency_type: 'months',
            }
        };

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };

        const mpResponse = await fetch(url, options);
        const data = await mpResponse.json();

        if (!mpResponse.ok) {
            console.error('Error de Mercado Pago:', data);
            return res.status(mpResponse.status).json({ error: 'Error devuelto por Mercado Pago', details: data });
        }
        
        return res.status(200).json({ id: data.id });

    } catch (error) {
        console.error('Error interno en la función:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}