#!/bin/sh
set -e

sed -i "s/^DB_CONNECTION=.*/DB_CONNECTION=${DB_CONNECTION:-pgsql}/" /app/.env
sed -i "s/^#\{0,1\} *DB_HOST=.*/DB_HOST=${DB_HOST:-laravel_db}/" /app/.env
sed -i "s/^#\{0,1\} *DB_PORT=.*/DB_PORT=${DB_PORT:-5432}/" /app/.env
sed -i "s/^#\{0,1\} *DB_DATABASE=.*/DB_DATABASE=${DB_DATABASE:-pilota_laravel}/" /app/.env
sed -i "s/^#\{0,1\} *DB_USERNAME=.*/DB_USERNAME=${DB_USERNAME:-pilota}/" /app/.env
sed -i "s/^#\{0,1\} *DB_PASSWORD=.*/DB_PASSWORD=${DB_PASSWORD:-pilota}/" /app/.env

php artisan migrate --force
php artisan db:seed --force
exec php artisan serve --host=0.0.0.0 --port=8000
