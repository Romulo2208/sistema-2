<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;

class PermissionUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('role_user')->delete();

        $permission_user = [
            ['permission_id' => '1',       'user_id' => '1', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], // permissão de login para geral
            // ['permission_id' => '1',       'user_id' => '2', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
            // ['permission_id' => '1',       'user_id' => '3', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
        ];

        \App\Models\PermissionUser::insert($permission_user);
    }
}
