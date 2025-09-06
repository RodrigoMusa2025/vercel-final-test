export default async function handler(req, res) {
    // 1. Intentamos leer la clave secreta desde la "caja fuerte" de Vercel.
    const accessToken = process.env.MP_ACCESS_TOKEN_TEST;

    // 2. Comprobamos si la encontramos.
    if (!accessToken) {
        // Si no la encontramos, enviamos un mensaje de error claro.
        return res.status(500).json({ 
            error: "ERROR FATAL: La variable de entorno MP_ACCESS_TOKEN_TEST no fue encontrada por Vercel." 
        });
    }

    // 3. Si SÍ la encontramos, enviamos un mensaje de éxito.
    return res.status(200).json({ 
        id: "¡ÉXITO! La clave secreta fue encontrada. El problema no está en Vercel." 
    });
}