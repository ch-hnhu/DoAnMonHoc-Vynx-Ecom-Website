<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class User
 * 
 * @property int $id
 * @property string $username
 * @property string $password
 * @property string $full_name
 * @property Carbon|null $dob
 * @property string $email
 * @property string|null $phone
 * @property string|null $image
 * @property string $role
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property Collection|Order[] $orders
 * @property Collection|ProductReview[] $product_reviews
 * @property Collection|ShoppingCart[] $shopping_carts
 * @property Collection|SupportRequest[] $support_requests
 * @property Collection|UserAddress[] $user_addresses
 *
 * @package App\Models
 */
class User extends Model
{
	use SoftDeletes;
	protected $table = 'users';

	protected $casts = [
		'dob' => 'datetime',
		'is_active' => 'bool'
	];

	protected $hidden = [
		'password'
	];

	protected $fillable = [
		'username',
		'password',
		'full_name',
		'dob',
		'email',
		'phone',
		'image',
		'role',
		'is_active'
	];

	public function orders()
	{
		return $this->hasMany(Order::class);
	}

	public function product_reviews()
	{
		return $this->hasMany(ProductReview::class);
	}

	public function shopping_carts()
	{
		return $this->hasMany(ShoppingCart::class);
	}

	public function support_requests()
	{
		return $this->hasMany(SupportRequest::class, 'supported_by');
	}

	public function user_addresses()
	{
		return $this->hasMany(UserAddress::class);
	}
}
