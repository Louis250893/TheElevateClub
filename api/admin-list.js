// api/admin-list.js — Liste les candidatures pour l'admin du Elevate Club

export default async function handler(req, res) {
  // CORS basique (tu peux restreindre plus tard si tu veux)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-token");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // Vérification du code admin
  const adminToken = process.env.ADMIN_TOKEN;
  const providedToken = req.headers["x-admin-token"];

  if (!adminToken) {
    console.error("ADMIN_TOKEN non configuré dans Vercel");
    return res.status(500).json({ error: "Configuration admin manquante." });
  }

  if (!providedToken || providedToken !== adminToken) {
    return res.status(401).json({ error: "Non autorisé." });
  }

  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const apiKey = process.env.AIRTABLE_API_KEY;
    const tableName = "Sélection Entrante";

    if (!baseId || !apiKey) {
      console.error("Config Airtable manquante pour admin-list");
      return res.status(500).json({ error: "Airtable non configuré." });
    }

    const url =
      "https://api.airtable.com/v0/" +
      baseId +
      "/" +
      encodeURIComponent(tableName) +
      "?pageSize=100&sort[0][field]=Name&sort[0][direction]=asc";

    const airtableResp = await fetch(url, {
      headers: {
        Authorization: "Bearer " + apiKey,
      },
    });

    if (!airtableResp.ok) {
      const text = await airtableResp.text();
      console.error("Erreur Airtable admin-list:", airtableResp.status, text);
      return res
        .status(500)
        .json({ error: "Erreur Airtable", details: text });
    }

    const data = await airtableResp.json();

    // On renvoie juste ce qui t'intéresse
    const rows =
      data.records?.map((rec) => ({
        id: rec.id,
        name: rec.fields["Name"] || "",
        ville: rec.fields["Ville"] || "",
        contact: rec.fields["Contact"] || "",
        mots: rec.fields["Trois mots"] || "",
        optionnel: rec.fields["Optionnel"] || "",
        parrain: rec.fields["Parrain"] || "",
        createdTime: rec.createdTime || "",
      })) || [];

    return res.status(200).json({ ok: true, rows });
  } catch (err) {
    console.error("Erreur admin-list:", err);
    return res.status(500).json({ error: "Erreur serveur admin." });
  }
}
