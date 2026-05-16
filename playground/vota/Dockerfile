FROM node:22-alpine
RUN npm install -g pnpm@8 --quiet

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY packages/ packages/
COPY playground/vota/ playground/vota/

RUN pnpm install

RUN pnpm --filter "@pilota/*" build

WORKDIR /app/playground/vota
EXPOSE 3002
CMD ["pnpm", "run", "dev"]
