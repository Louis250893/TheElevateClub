// api/submit.js – fonction Vercel → Airtable

module.exports = async (req, res) => {
  // CORS (pour que ton formulaire puisse appeler l’API)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 🔐 Variables d'environnement (NE PAS METTRE DE CLÉ ICI)
  const baseId = process.env.AIRTABLE_BASE_ID;
  const apiKey = process.env.AIRTABLE_API_KEY;

  if (!baseId || !apiKey) {
    console.error("Config Airtable manquante", {
      baseIdPresent: !!baseId,
      apiKeyPresent: !!apiKey,
    });
    return res.status(500).send("Configuration serveur incomplète.");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { name, city, contact, words, note, parrain } = req.body || {};

    const tableName = "Sélection Entrante";
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
      tableName
    )}`;

    const airtableResp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: Bearer ${apiKey},
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Name: name || "",
          Ville: city || "",
          Contact: contact || "",
          "Trois mots": words || "",
          Optionnel: note || "",
          Parrain: parrain || "",
        },
      }),
    });

    if (!airtableResp.ok) {
      const text = await airtableResp.text();
      console.error("Erreur Airtable:", airtableResp.status, text);
      return res.status(500).send("Erreur lors de l’envoi vers Airtable.");
    }

    const data = await airtableResp.json();
    return res.status(200).json({ ok: true, id: data.id || null });
  } catch (err) {
    console.error("Erreur serveur:", err);
    return res.status(500).send("Erreur serveur interne.");
  }
};
