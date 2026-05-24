BRANCH ?= $(shell git rev-parse --abbrev-ref HEAD 2>/dev/null | tr '/' '-' | tr '_' '-' | sed 's/^HEAD$$/dev/')

export BRANCH
export COMPOSE_PROJECT_NAME = pilota-$(BRANCH)

.PHONY: proxy-init proxy-up proxy-down \
	up down restart logs status \
	laravel-logs laravel-restart laravel-rebuild laravel-shell laravel-seed laravel-reset \
	pulse-logs pulse-restart pulse-rebuild \
	vota-logs vota-restart vota-rebuild \
	gearup-logs gearup-restart gearup-rebuild \
	shoplab-logs shoplab-restart shoplab-rebuild \
	nhost-logs nhost-restart \
	supabase-logs supabase-restart \
	tolgee-logs tolgee-restart \
	traefik-logs traefik-restart

# ─── Shared infrastructure (once per machine) ──────────────────────────────

proxy-init:
	@docker network create pilota-proxy 2>/dev/null || true

proxy-up: proxy-init
	@echo "Stopping standalone tolgee container if it exists..."
	-docker stop tolgee 2>/dev/null; docker rm tolgee 2>/dev/null
	docker compose -p pilota-proxy -f docker-compose.traefik.yml up -d

proxy-down:
	docker compose -p pilota-proxy -f docker-compose.traefik.yml down

# ─── Branch stack (auto-detected from git branch) ──────────────────────────

up: proxy-init
	@echo "Starting branch: $(BRANCH) → http://$(BRANCH)-hub.localhost"
	docker compose up -d

down:
	docker compose down

restart: down up

logs:
	docker compose logs -f

status:
	@echo "=== Proxy (shared) ==="
	@docker compose -p pilota-proxy -f docker-compose.traefik.yml ps 2>/dev/null || echo "(not running)"
	@echo ""
	@echo "=== Branch: $(BRANCH) ==="
	docker compose ps

# ─── Laravel ───────────────────────────────────────────────────────────────

laravel-logs:
	docker compose logs -f laravel

laravel-restart:
	docker compose restart laravel

laravel-rebuild:
	docker compose up -d --build laravel

laravel-shell:
	docker compose exec laravel sh

laravel-seed:
	docker compose exec laravel php artisan db:seed

laravel-reset:
	docker compose exec laravel php artisan migrate:fresh --seed

# ─── Pulse ─────────────────────────────────────────────────────────────────

pulse-logs:
	docker compose logs -f pulse

pulse-restart:
	docker compose restart pulse

pulse-rebuild:
	docker compose up -d --build pulse

# ─── Vota ──────────────────────────────────────────────────────────────────

vota-logs:
	docker compose logs -f vota

vota-restart:
	docker compose restart vota

vota-rebuild:
	docker compose up -d --build vota

# ─── Gearup ────────────────────────────────────────────────────────────────

gearup-logs:
	docker compose logs -f gearup

gearup-restart:
	docker compose restart gearup

gearup-rebuild:
	docker compose up -d --build gearup

# ─── Shoplab ───────────────────────────────────────────────────────────────

shoplab-logs:
	docker compose logs -f shoplab

shoplab-restart:
	docker compose restart shoplab

shoplab-rebuild:
	docker compose up -d --build shoplab

# ─── Nhost / Hasura ────────────────────────────────────────────────────────

nhost-logs:
	docker compose logs -f nhost_hasura nhost_db

nhost-restart:
	docker compose restart nhost_hasura

# ─── Supabase ──────────────────────────────────────────────────────────────

supabase-logs:
	docker compose logs -f supabase_gateway supabase_rest supabase_realtime supabase_db

supabase-restart:
	docker compose restart supabase_rest supabase_realtime supabase_gateway

# ─── Traefik (proxy) ───────────────────────────────────────────────────────

traefik-logs:
	docker compose -p pilota-proxy -f docker-compose.traefik.yml logs -f traefik

traefik-restart:
	docker compose -p pilota-proxy -f docker-compose.traefik.yml restart traefik

# ─── Tolgee (proxy) ────────────────────────────────────────────────────────

tolgee-logs:
	docker compose -p pilota-proxy -f docker-compose.traefik.yml logs -f tolgee

tolgee-restart:
	docker compose -p pilota-proxy -f docker-compose.traefik.yml restart tolgee
