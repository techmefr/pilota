FROM php:8.3-cli-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-dev curl unzip \
    && docker-php-ext-install pdo_pgsql bcmath

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Composer 2.x blocks packages flagged by security advisories by default, which
# rejects the unpinned laravel/laravel ^11 range. This is a local POC backend, so
# disable advisory blocking to let create-project resolve.
RUN composer config -g policy.advisories.block false \
    && composer create-project laravel/laravel:^11.0 . --no-interaction --prefer-dist \
    && cp .env.example .env \
    && php artisan key:generate

RUN composer require lomkit/laravel-rest-api stripe/stripe-php --no-interaction

RUN rm -rf database/migrations/*

# Note: no local app/ overlay — the default app/ from `composer create-project`
# is kept; domain code lives under functional/ (PSR-4 wired by setup-autoload.php).
COPY bootstrap/ bootstrap/
COPY config/ config/
COPY database/ database/
COPY routes/ routes/
COPY functional/ functional/
COPY setup-autoload.php setup-autoload.php

RUN cp functional/Users/database/migrations/*.php database/migrations/ \
    && cp functional/Cart/database/migrations/*.php database/migrations/ \
    && cp functional/Products/database/migrations/*.php database/migrations/ \
    && cp functional/Gearup/database/migrations/*.php database/migrations/ \
    && cp functional/Pulse/database/migrations/*.php database/migrations/ \
    && cp functional/Shoplab/database/migrations/*.php database/migrations/ \
    && php setup-autoload.php && rm setup-autoload.php && composer dump-autoload --optimize

RUN chmod -R 775 storage bootstrap/cache

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["docker-entrypoint.sh"]
