# Sentry Self-Hosted

Ce guide installe Sentry sur votre machine via Docker. Une fois lancé, Sentry tourne sur **http://localhost:9000**.

## Installation

```bash
git clone https://github.com/getsentry/self-hosted sentry-self-hosted
cd sentry-self-hosted
./install.sh
```

L'installation prend environ 15 minutes (téléchargement des images, migrations, etc.).

## Démarrage

```bash
cd sentry-self-hosted
docker compose up -d
```

Sentry sera disponible sur http://localhost:9000.

Identifiants créés lors du `./install.sh` (vous les avez choisis pendant l'install).

## Configuration des projets

Dans Sentry, créer un projet par frontend :

| Frontend | Plateforme Sentry | Variable d'env |
|----------|-------------------|----------------|
| Gearup   | Astro             | `PUBLIC_SENTRY_DSN` |
| Pulse    | Next.js           | `NEXT_PUBLIC_SENTRY_DSN` |
| Vota     | SvelteKit         | `PUBLIC_SENTRY_DSN` |
| Shoplab  | Vue (Nuxt)        | `NUXT_PUBLIC_SENTRY_DSN` |

Pour chaque projet : **Settings → Client Keys (DSN)** → copier le DSN.

## Variables d'environnement

Créer un fichier `.env` à la racine du monorepo (à côté de `docker-compose.yml`) :

```env
# Sentry DSNs
PUBLIC_SENTRY_DSN=https://xxx@localhost:9000/1
NEXT_PUBLIC_SENTRY_DSN=https://xxx@localhost:9000/2
NUXT_PUBLIC_SENTRY_DSN=https://xxx@localhost:9000/3
```

> Vota (SvelteKit) partage `PUBLIC_SENTRY_DSN` avec Gearup ou utilisez un projet différent.

Les variables sont transmises aux containers via les `docker-compose.yml` de chaque playground.

## Widget Feedback

Chaque frontend embarque le **Sentry Feedback Widget** (bouton flottant) configuré en français. Les remontées apparaissent dans Sentry sous **Feedback → User Feedback**.
