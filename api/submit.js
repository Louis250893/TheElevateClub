export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { name, city, contact, words, note, parrain } = req.body;

// …

const airtableResp = await fetch(
  `https://api.airtable.com/v0/${baseId}/Sélection Entrante`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
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
      const errorTxt = await airtableResp.text();
      console.error("Erreur Airtable:", airtableResp.status, errorTxt);
      return res.status(500).send("Erreur Airtable");
    }

    return res.status(200).send("OK");
  } catch (e) {
    console.error(e);
    return res.status(500).send("Erreur interne");
  }
}
