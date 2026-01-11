<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		DB::table('users')->insert([
			[
				'username' => 'admin',
				'password' => Hash::make('admin@123'),
				'full_name' => 'Nguyễn Văn Admin',
				'dob' => '1990-01-15',
				'email' => 'admin@vynx.com',
				'phone' => '0123456789',
				'image' => 'https://example.com/avatars/admin.jpg',
				'role' => 'admin',
				'is_active' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'username' => 'employee01',
				'password' => Hash::make('employee123'),
				'full_name' => 'Trần Thị Nhân Viên',
				'dob' => '1995-05-20',
				'email' => 'employee@vynx.com',
				'phone' => '0987654321',
				'image' => 'https://example.com/avatars/employee.jpg',
				'role' => 'employee',
				'is_active' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'username' => 'customer01',
				'password' => Hash::make('customer123'),
				'full_name' => 'Lê Minh Khách',
				'dob' => '1998-08-10',
				'email' => 'customer01@gmail.com',
				'phone' => '0369852147',
				'image' => 'https://example.com/avatars/customer1.jpg',
				'role' => 'customer',
				'is_active' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'username' => 'customer02',
				'password' => Hash::make('customer456'),
				'full_name' => 'Phạm Thu Hương',
				'dob' => '2000-12-25',
				'email' => 'customer02@gmail.com',
				'phone' => '0258147963',
				'image' => 'https://example.com/avatars/customer2.jpg',
				'role' => 'customer',
				'is_active' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],
		]);
	}
}
