export default async function handler(req, res) {
  // CORS pour autoriser l'appel depuis ton site (GitHub / Vercel)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { name, city, contact, words, note, parrain } = req.body;

    const baseId = process.env.AIRTABLE_BASE_ID;
    const apiKey = process.env.AIRTABLE_API_KEY;

    if (!baseId || !apiKey) {
      console.error("AIRTABLE_BASE_ID ou AIRTABLE_API_KEY manquant");
      return res.status(500).send("Configuration serveur manquante");
    }

    const airtableResp = await fetch(
      https://api.airtable.com/v0/${baseId}/Sélection Entrante,
      {
        method: "POST",
        headers: {
          Authorization: Bearer ${apiKey},
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Name": name || "",
            "Ville": city || "",
            "Contact": contact || "",
            "Trois mots": words || "",
            "Optionnel": note || "",
            "Parrain": parrain || "",
          },
        }),
      }
    );

    if (!airtableResp.ok) {
      const txt = await airtableResp.text();
      console.error("Airtable error:", airtableResp.status, txt);
      return res.status(500).send("Erreur Airtable");
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).send("Erreur serveur");
  }
}
