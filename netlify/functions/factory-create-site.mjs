import { timingSafeEqual } from "node:crypto";

const json = (status, body) => Response.json(body, {
  status,
  headers: { "cache-control": "no-store" },
});

function safeEqual(a, b) {
  if (!a || !b) return false;
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export default async (req) => {
  if (req.method !== "POST") {
    return json(405, { error: "Méthode non autorisée. Utilise POST." });
  }

  const adminKey = Netlify.env.get("FACTORY_ADMIN_KEY");
  const suppliedKey = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!safeEqual(suppliedKey, adminKey)) {
    return json(401, { error: "Authentification refusée." });
  }

  const GITHUB_TOKEN = Netlify.env.get("GITHUB_TOKEN");
  const GITHUB_OWNER = Netlify.env.get("GITHUB_OWNER");
  const NETLIFY_TOKEN = Netlify.env.get("NETLIFY_TOKEN");
  const NETLIFY_GITHUB_INSTALLATION_ID = Netlify.env.get("NETLIFY_GITHUB_INSTALLATION_ID");
  const missing = [
    ["GITHUB_TOKEN", GITHUB_TOKEN],
    ["GITHUB_OWNER", GITHUB_OWNER],
    ["NETLIFY_TOKEN", NETLIFY_TOKEN],
    ["NETLIFY_GITHUB_INSTALLATION_ID", NETLIFY_GITHUB_INSTALLATION_ID],
  ].filter(([, value]) => !value).map(([key]) => key);

  if (missing.length) {
    return json(503, { error: "Configuration incomplète.", missing });
  }

  let input;
  try {
    input = await req.json();
  } catch {
    return json(400, { error: "Le corps doit être un JSON valide." });
  }

  const name = String(input.name || "").trim().toLowerCase();
  const description = String(input.description || "Site créé avec GitHub Factory").trim().slice(0, 350);
  const visibility = input.private === false ? "public" : "private";

  if (!/^[a-z0-9](?:[a-z0-9-]{0,38})$/.test(name)) {
    return json(400, { error: "Nom invalide. Utilise 1 à 39 caractères : lettres minuscules, chiffres et tirets." });
  }

  const ghHeaders = {
    authorization: `Bearer ${GITHUB_TOKEN}`,
    accept: "application/vnd.github+json",
    "content-type": "application/json",
    "x-github-api-version": "2022-11-28",
  };

  let repo;
  try {
    const createRepo = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers: ghHeaders,
      body: JSON.stringify({ name, description, private: visibility === "private", auto_init: true }),
    });
    const payload = await createRepo.json();
    if (!createRepo.ok) {
      return json(createRepo.status === 422 ? 409 : 502, {
        error: "GitHub n'a pas pu créer le dépôt.",
        detail: payload.message || "Erreur GitHub.",
      });
    }
    if (payload.owner?.login?.toLowerCase() !== GITHUB_OWNER.toLowerCase()) {
      return json(502, {
        error: "Le dépôt a été créé sur un compte inattendu. Vérifie le compte associé au jeton GitHub.",
        repository: payload.html_url,
      });
    }
    repo = payload;
  } catch {
    return json(502, { error: "Impossible de joindre GitHub." });
  }

  const page = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#101827">
  <title>${name}</title>
  <style>
    *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#101827;color:#edf4ff;font:16px system-ui,sans-serif}
    main{max-width:680px;padding:42px;border:1px solid #2b4567;border-radius:24px;background:#17243a}
    h1{font-size:clamp(2rem,7vw,4rem);margin:0 0 12px}p{color:#b7c8df;line-height:1.7}
    a{color:#79bdff}
  </style>
</head>
<body><main><p>GITHUB FACTORY</p><h1>${name}</h1><p>Ton site est créé et relié à son dépôt GitHub. Tu peux maintenant remplacer cette page par ton vrai projet.</p><p><a href="https://github.com/${repo.full_name}">Voir le dépôt GitHub</a></p></main></body>
</html>`;
  try {
    const pushPage = await fetch(`https://api.github.com/repos/${repo.full_name}/contents/index.html`, {
      method: "PUT",
      headers: ghHeaders,
      body: JSON.stringify({
        message: "Add initial site page",
        content: Buffer.from(page, "utf8").toString("base64"),
      }),
    });
    if (!pushPage.ok) {
      const detail = await pushPage.json().catch(() => ({}));
      return json(502, {
        error: "Le dépôt GitHub existe, mais la page initiale n'a pas pu être ajoutée.",
        repository: repo.html_url,
        detail: detail.message || "Erreur GitHub.",
      });
    }
  } catch {
    return json(502, {
      error: "Le dépôt GitHub existe, mais l'ajout de la page initiale a échoué.",
      repository: repo.html_url,
    });
  }

  try {
    const createSite = await fetch("https://api.netlify.com/api/v1/sites", {
      method: "POST",
      headers: {
        authorization: `Bearer ${NETLIFY_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        repo: {
          provider: "github",
          repo: repo.full_name,
          repo_id: repo.id,
          branch: repo.default_branch || "main",
          cmd: "",
          dir: ".",
          private: visibility === "private",
          installation_id: NETLIFY_GITHUB_INSTALLATION_ID,
        },
      }),
    });
    const site = await createSite.json();
    if (!createSite.ok) {
      return json(502, {
        error: "Le dépôt GitHub est prêt, mais Netlify n'a pas pu le relier.",
        repository: repo.html_url,
        detail: site.message || site.error || "Vérifie l'installation de l'application Netlify GitHub et les autorisations du compte.",
      });
    }

    return json(201, {
      status: "created",
      repository: repo.html_url,
      site: site.ssl_url || site.url,
      netlifyProject: site.name,
      message: "Le dépôt et le projet Netlify ont été créés. Le premier déploiement peut prendre quelques minutes.",
    });
  } catch {
    return json(502, {
      error: "Le dépôt GitHub est prêt, mais la création du projet Netlify a échoué.",
      repository: repo.html_url,
    });
  }
};
