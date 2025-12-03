// api/submit.js – Fonction Vercel qui envoie les données vers Airtable

export default async function handler(req, res) {
  // CORS : autoriser les requêtes depuis ton frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Pré-requête du navigateur (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 🔐 Variables d'environnement définies dans Vercel
  const baseId = process.env.AIRTABLE_BASE_ID;
  const apiKey = process.env.AIRTABLE_API_KEY;

  if (!baseId || !apiKey) {
    console.error("Configuration Airtable manquante :", {
      baseIdPresent: !!baseId,
      apiKeyPresent: !!apiKey,
    });
    return res
      .status(500)
      .json({ error: "Configuration serveur Airtable manquante." });
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
        // ✅ on utilise une chaîne normale, plus d’erreur de syntaxe
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          // ⚠️ Ces noms doivent correspondre exactement aux en-têtes de colonnes Airtable
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
      const txt = await airtableResp.text();
      console.error("Erreur Airtable :", airtableResp.status, txt);
      return res.status(500).json({ error: "Erreur lors de l’envoi à Airtable." });
    }

    const json = await airtableResp.json();
    // json peut contenir "id" ou "records[0].id" selon l’API, mais ce n’est pas bloquant pour toi
    return res.status(200).json({ ok: true, airtableResponse: json });
  } catch (err) {
    console.error("Erreur inattendue côté serveur :", err);
    return res.status(500).json({ error: "Erreur serveur." });
  }
}
