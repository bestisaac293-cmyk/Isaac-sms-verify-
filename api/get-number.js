// api/get-number.js

export default async function handler(req, res) {
    // 1. Get parameters (e.g., country, product) from the user's request
    const { country, product } = req.query;

    // 2. Security: Get your API Key from Vercel Environment Variables
    // The key is stored in Vercel Settings, not in this file!
    const API_KEY = SMS_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: "API Key not configured on server" });
    }

    try {
        // 3. Fetch from the SMS provider (Example using 5SIM)
        const response = await fetch(`https://5sim.net/v1/user/buy/activation/${country}/any/${product}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });
        
        const data = await response.json();

        // 4. Send the provider's response back to your frontend
        if (response.ok) {
            res.status(200).json(data);
        } else {
            res.status(response.status).json({ error: "Provider Error", details: data });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to SMS provider" });
    }
}
