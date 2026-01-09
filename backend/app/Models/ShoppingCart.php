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
 * Class ShoppingCart
 * 
 * @property int $id
 * @property int|null $user_id
 * @property string|null $session_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property User|null $user
 * @property Collection|CartItem[] $cart_items
 *
 * @package App\Models
 */
class ShoppingCart extends Model
{
	use SoftDeletes;
	protected $table = 'shopping_carts';

	protected $casts = [
		'user_id' => 'int'
	];

	protected $fillable = [
		'user_id',
		'session_id'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function cart_items()
	{
		return $this->hasMany(CartItem::class, 'cart_id');
	}
}
