FROM php:8.3-cli-alpine

WORKDIR /var/www

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

RUN php -r "
\$json = json_decode(file_get_contents('composer.json'), true);
\$json['autoload']['psr-4']['Functional\\\\Users\\\\'] = 'functional/Users/src/';
\$json['autoload']['psr-4']['Functional\\\\Cart\\\\'] = 'functional/Cart/src/';
\$json['autoload']['psr-4']['Functional\\\\Users\\\\Database\\\\Seeders\\\\'] = 'functional/Users/database/seeders/';
\$json['autoload']['psr-4']['Functional\\\\Cart\\\\Database\\\\Seeders\\\\'] = 'functional/Cart/database/seeders/';
file_put_contents('composer.json', json_encode(\$json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
" && composer dump-autoload --optimize

RUN chmod -R 775 storage bootstrap/cache

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["docker-entrypoint.sh"]
