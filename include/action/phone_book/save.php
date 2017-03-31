<?php

namespace phone_book;

class save {

    public static function getUser() {
        return ['stranger' => '*'];
    }

    public static function execute($p) {
        $q = "delete from phone_number";
        \db\init(DB_PATH_PUBLIC);
        \db\command($q);
        $r = true;
        foreach ($p as $v) {
            $q = "insert into phone_number(group_id, value) values ({$v['group_id']},'{$v['value']}')";
            $r = $r && \db\commandF($q);
        }
        if (!$r) {
            \db\suspend();
            throw new \Exception('some of inserts failed');
        }
        \db\suspend();
    }

}
