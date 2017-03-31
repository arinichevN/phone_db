<?php

define('DB_PATH_PUBLIC', '/etc/controller/public.db');

function f_getConfig() {
    return [
                'db' => [
            'use' => 'l'
        ],
        'session' => [
            'use' => '4',
        ],
        'check' => [
            'use' => [1],
        ]
    ];
}
