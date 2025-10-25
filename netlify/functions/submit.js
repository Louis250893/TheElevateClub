export default async function handler(req, res) {
  // Autoriser la connexion depuis ton site
  res.setHeader("Access-Control-Allow-Origin", "https://louis250893.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
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
  return res.status(response.status).json(result);
}
