FROM node:22-alpine
RUN npm install -g pnpm@8 --quiet

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY packages/ packages/
COPY playground/nuxt/ playground/nuxt/

RUN pnpm install

RUN pnpm --filter "@pilota/*" build

WORKDIR /app/playground/nuxt
EXPOSE 3000
CMD ["pnpm", "run", "dev"]
