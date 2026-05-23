.PHONY: up down restart logs status \
	laravel-logs laravel-restart laravel-rebuild laravel-shell laravel-seed laravel-reset \
	pulse-logs pulse-restart pulse-rebuild \
	vota-logs vota-restart vota-rebuild \
	gearup-logs gearup-restart gearup-rebuild \
	shoplab-logs shoplab-restart shoplab-rebuild \
	nhost-logs nhost-restart \
	supabase-logs supabase-restart \
	tolgee-logs tolgee-restart \
	traefik-logs traefik-restart

up:
	@echo "Stopping standalone tolgee container if it exists..."
	-docker stop tolgee 2>/dev/null; docker rm tolgee 2>/dev/null
	docker compose up -d

down:
	docker compose down

restart: down up

logs:
	docker compose logs -f

status:
	docker compose ps

# --- Laravel ---

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

# --- Pulse ---

pulse-logs:
	docker compose logs -f pulse

pulse-restart:
	docker compose restart pulse

pulse-rebuild:
	docker compose up -d --build pulse

# --- Vota ---

vota-logs:
	docker compose logs -f vota

vota-restart:
	docker compose restart vota

vota-rebuild:
	docker compose up -d --build vota

# --- Gearup ---

gearup-logs:
	docker compose logs -f gearup

gearup-restart:
	docker compose restart gearup

gearup-rebuild:
	docker compose up -d --build gearup

# --- Shoplab ---

shoplab-logs:
	docker compose logs -f shoplab

shoplab-restart:
	docker compose restart shoplab

shoplab-rebuild:
	docker compose up -d --build shoplab

# --- Nhost / Hasura ---

nhost-logs:
	docker compose logs -f nhost_hasura nhost_db

nhost-restart:
	docker compose restart nhost_hasura

# --- Supabase ---

supabase-logs:
	docker compose logs -f supabase_gateway supabase_rest supabase_realtime supabase_db

supabase-restart:
	docker compose restart supabase_rest supabase_realtime supabase_gateway

# --- Tolgee ---

tolgee-logs:
	docker compose logs -f tolgee

tolgee-restart:
	docker compose restart tolgee

# --- Traefik ---

traefik-logs:
	docker compose logs -f traefik

traefik-restart:
	docker compose restart traefik
