export default async function handler(req, res) {
  // Autoriser l'accès depuis ton site GitHub Pages
res.setHeader("Access-Control-Allow-Origin", "https://louis250893.github.io");
res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { name, city, contact, words, optional, parrain } = req.body;

    const baseId = process.env.AIRTABLE_BASE_ID;
    const apiKey = process.env.AIRTABLE_API_KEY;

    const airtableResp = await fetch(`https://api.airtable.com/v0/${baseId}/Sélection Entrante`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          "Name": name,
          "Ville": city,
          "Contact": contact,
          "Trois mots": words,
          "Optionnel": optional,
          "Parrain": parrain
        }
      })
    });

    if (!airtableResp.ok) {
      const txt = await airtableResp.text();
      return res.status(500).json({ error: txt });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
}
