<?php

namespace phone_book;

class geta {

    public static function getUser() {
        return ['stranger' => '*'];
    }

    public static function execute() {
        $q = "select group_id, value from phone_number order by group_id, value asc";
        \db\init(DB_PATH_PUBLIC);
        $data = \db\getDataAll($q);
        \db\suspend();
        return $data;
    }
}
