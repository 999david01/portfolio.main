export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const { name, email, message, website } = req.body;

    // Honeypot (spam protection)
    if (website) {
        return res.status(200).json({ ok: true });
    }

    // Basic validation
    if (!name || !email || !message) {
        return res
            .status(400)
            .json({ ok: false, error: "Missing required fields" });
    }

    // For now we just accept the message
    // (You can later add email sending here)
    console.log("New contact message:", { name, email, message });

    return res.status(200).json({ ok: true });
}
