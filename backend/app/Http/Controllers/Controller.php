<?php


namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
abstract class Controller
{
    public function getAllData()
    {
        return DB::select('select * from users ');
    }
}
