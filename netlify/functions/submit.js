export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const TABLE = "Sélection Entrante";

  const { name, city, contact, words, note, parrain } = req.body;

  const record = {
    fields: {
      Date: new Date().toISOString(),
      Nom: name,
      Ville: city,
      Contact: contact,
      "Trois mots": words,
      Note: note,
      Parrain: parrain
    }
  };

  const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE)}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(record)
  });

  const result = await response.json();
  res.status(response.status).json(result);
}
