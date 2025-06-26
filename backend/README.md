## Configurações para o gitlab
[http "http://gitlab.ccabr.intraer/sai/profesp-backend.git"]
 proxy = 


## Backend do Projeto PROFEST em Laravel
1. Para Iniciar o projeto:
2. git clone http://gitlab.ccabr.intraer/sai/profesp-backend.git
3. composer install
4. "criar um arquivo .env a partir do .env.example". "Configurar nesse arquivo qual banco utilizar"
5. php artisan migrate --seed. Ou: php artisan migrate:refresh --seed. "Se quiser derrubar tudo e reconstruir
6. php artisan key:generate
7. php artisan serve

