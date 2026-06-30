FROM node:22-alpine
RUN npm install -g pnpm@8 --quiet
RUN npm install -g @angular/cli@19 --quiet

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY packages/ packages/
COPY playground/fleet-commander/ playground/fleet-commander/

RUN pnpm install
RUN pnpm --filter "./packages/**" build

WORKDIR /app/playground/fleet-commander
EXPOSE 3004

CMD ["sh", "-c", "\
  sed -i 's|%%LARAVEL_API_URL%%|'\"${LARAVEL_API_URL:-http://main-api.localhost/api}\"'|g' src/index.html && \
  sed -i 's|%%SUPABASE_URL%%|'\"${SUPABASE_URL:-http://main-supabase.localhost}\"'|g' src/index.html && \
  sed -i 's|%%NHOST_ENDPOINT%%|'\"${NHOST_ENDPOINT:-http://main-hasura.localhost/v1/graphql}\"'|g' src/index.html && \
  sed -i 's|%%TOLGEE_API_URL%%|'\"${TOLGEE_API_URL:-http://tolgee.localhost}\"'|g' src/index.html && \
  sed -i 's|%%TOLGEE_API_KEY%%|'\"${TOLGEE_API_KEY:-}\"'|g' src/index.html && \
  sed -i 's|%%SUPABASE_ANON_KEY%%|'\"${SUPABASE_ANON_KEY:-pilota}\"'|g' src/index.html && \
  sed -i 's|%%SENTRY_DSN%%|'\"${SENTRY_DSN:-}\"'|g' src/index.html && \
  ng serve --host 0.0.0.0 --port 3004\
"]
