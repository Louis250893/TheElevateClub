export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { nom, city, contact, words, optionnel, parrain } = req.body;

    const baseId = process.env.AIRTABLE_BASE_ID;
    const apiKey = process.env.AIRTABLE_API_KEY;

    const resp = await fetch(`https://api.airtable.com/v0/${baseId}/Sélection Entrante`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          "Nom": nom,
          "Ville": city,
          "Contact": contact,
          "Trois mots": words,
          "Optionnel": optionnel,
          "Parrain": parrain
        }
      })
    });

    const data = await resp.json();

    return res.status(200).json({ ok: true, airtable: data });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur", details: err });
  }
}
