export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://louis250893.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { name, city, contact, words, note, parrain } = req.body;

    const baseId = process.env.AIRTABLE_BASE_ID;
    const apiKey = process.env.AIRTABLE_API_KEY;

    const airtableResp = await fetch(`https://api.airtable.com/v0/${baseId}/Sélection Entrante`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: {
          "Nom": name,
          "Ville": city,
          "Contact": contact,
          "Trois mots": words,
          "Optionnel": note,
          "Parrain": parrain
        }
      })
    });

    const result = await airtableResp.json();
    return res.status(200).json(result);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
