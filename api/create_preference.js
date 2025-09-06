// /api/create_preference.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
        const url = 'https://api.mercadopago.com/checkout/preferences';
        const planId = 'de7fad4ab7ad4147b0588a9a775c2f99'; // Tu Plan de PRODUCCIÓN
        const accessToken = process.env.MP_ACCESS_TOKEN; // Tu Access Token de PRODUCCIÓN

        if (!accessToken) {
            return res.status(500).json({ error: 'Error de configuración del servidor.' });
        }

        const body = {
            items: [{
                title: 'Suscripción Mensual EvolutionGlute',
                quantity: 1,
                unit_price: 100.00, // IMPORTANTE: Pon aquí el precio exacto de tu plan
                currency_id: 'ARS'
            }],
            back_urls: { 
                success: 'https://nueva-gules.vercel.app/', 
                failure: 'https://nueva-gules.vercel.app/',
                pending: 'https://nueva-gules.vercel.app/'
            },
            preapproval_plan_id: planId
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