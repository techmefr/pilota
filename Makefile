.PHONY: up down logs build test lint

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

build:
	pnpm build

test:
	pnpm test

lint:
	pnpm lint
