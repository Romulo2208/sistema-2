<?php
// /config/authldap.php

return [
    /*
    |-------------------------------------------
    | Host
    |-------------------------------------------
    |
    | Servidor da base Ldap
    |
    */
 
    'host' => env('AUTH_LDAP_HOST','10.228.64.168'),
 
    /*
    |-------------------------------------------
    | Porta
    |-------------------------------------------
    |
    | Porta do servidor da Base Ldap
    |
    */
 
    'porta' => env('AUTH_LDAP_PORTA','389'),
    
    
    /*
    |-------------------------------------------
    | Prefixo da Consulta Ldap
    |-------------------------------------------
    |
    | Esse prefixo é utilizado na consulta do dn completo do usuário
    |
    */
 
    'prefix' => env('AUTH_LDAP_PREFIX','uid='),
    
    
    /*
    |-------------------------------------------
    | Base DN
    |-------------------------------------------
    |
    | Base DN. caminho completo para encontrar o usuário
    |
    */
 
    'base_dn' => env('AUTH_LDAP_BASE_DN','ou=contas,dc=fab,dc=intraer'),
    
    
];
