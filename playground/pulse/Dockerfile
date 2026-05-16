FROM node:22-alpine
RUN npm install -g pnpm@8 --quiet

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY packages/ packages/
COPY playground/pulse/ playground/pulse/

RUN pnpm install

RUN pnpm --filter "@pilota/*" build

WORKDIR /app/playground/pulse
EXPOSE 3001
CMD ["pnpm", "run", "dev"]
