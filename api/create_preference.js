// /api/create_preference.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const fetch = (await import('node-fetch')).default;
        const url = 'https://api.mercadopago.com/preapproval';
        
        // ESTE ES TU NUEVO Y CORRECTO ID DE PLAN DE PRUEBA
        const planId = 'c8f83df62e9a485bb3a70551636fde95';
        
        const accessToken = process.env.MP_ACCESS_TOKEN_TEST;

        if (!accessToken) {
            console.error("Error: La variable de entorno MP_ACCESS_TOKEN_TEST no está configurada.");
            return res.status(500).json({ error: 'Error de configuración del servidor.' });
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
            return res.status(mpResponse.status).json({ error: 'Error devuelto por Mercado Pago' });
        }
        
        return res.status(200).json({ id: data.id });

    } catch (error) {
        console.error('Error interno en la función:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}