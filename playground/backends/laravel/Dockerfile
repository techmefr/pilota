FROM php:8.3-cli-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-dev curl unzip \
    && docker-php-ext-install pdo_pgsql bcmath

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN composer create-project laravel/laravel:^11.0 . --no-interaction --prefer-dist \
    && cp .env.example .env \
    && php artisan key:generate

RUN composer require lomkit/laravel-rest-api --no-interaction

RUN rm -rf database/migrations/*

COPY bootstrap/ bootstrap/
COPY config/ config/
COPY app/ app/
COPY database/ database/
COPY routes/ routes/
COPY functional/ functional/
COPY setup-autoload.php setup-autoload.php

RUN cp functional/Users/database/migrations/*.php database/migrations/ \
    && cp functional/Cart/database/migrations/*.php database/migrations/ \
    && cp functional/Products/database/migrations/*.php database/migrations/ \
    && cp functional/Gearup/database/migrations/*.php database/migrations/ \
    && php setup-autoload.php && rm setup-autoload.php && composer dump-autoload --optimize

RUN chmod -R 775 storage bootstrap/cache

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["docker-entrypoint.sh"]
