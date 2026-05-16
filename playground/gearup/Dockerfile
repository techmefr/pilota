FROM node:22-alpine
RUN npm install -g pnpm@8 --quiet

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY packages/ packages/
COPY playground/gearup/ playground/gearup/

RUN pnpm install

RUN pnpm --filter "@pilota/*" build

WORKDIR /app/playground/gearup
EXPOSE 3003
CMD ["pnpm", "run", "dev"]
