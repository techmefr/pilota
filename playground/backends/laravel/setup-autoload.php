<?php
$json = json_decode(file_get_contents('composer.json'), true);
$json['autoload']['psr-4']['Functional\\Users\\'] = 'functional/Users/src/';
$json['autoload']['psr-4']['Functional\\Cart\\'] = 'functional/Cart/src/';
$json['autoload']['psr-4']['Functional\\Products\\'] = 'functional/Products/src/';
$json['autoload']['psr-4']['Functional\\Users\\Database\\Seeders\\'] = 'functional/Users/database/seeders/';
$json['autoload']['psr-4']['Functional\\Cart\\Database\\Seeders\\'] = 'functional/Cart/database/seeders/';
$json['autoload']['psr-4']['Functional\\Products\\Database\\Seeders\\'] = 'functional/Products/database/seeders/';
$json['autoload']['psr-4']['Functional\\Gearup\\'] = 'functional/Gearup/src/';
$json['autoload']['psr-4']['Functional\\Gearup\\Database\\Seeders\\'] = 'functional/Gearup/database/seeders/';
$json['autoload']['psr-4']['Functional\\Gearup\\Database\\Migrations\\'] = 'functional/Gearup/database/migrations/';
file_put_contents('composer.json', json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
