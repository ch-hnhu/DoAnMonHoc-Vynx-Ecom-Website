<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class CartItem
 * 
 * @property int $cart_id
 * @property int $product_id
 * @property int $quantity
 * @property float $price
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property ShoppingCart $shopping_cart
 * @property Product $product
 *
 * @package App\Models
 */
class CartItem extends Model
{
	protected $table = 'cart_items';
	public $incrementing = false;

	protected $casts = [
		'cart_id' => 'int',
		'product_id' => 'int',
		'quantity' => 'int',
		'price' => 'float'
	];

	protected $fillable = [
		'quantity',
		'price'
	];

	public function shopping_cart()
	{
		return $this->belongsTo(ShoppingCart::class, 'cart_id');
	}

	public function product()
	{
		return $this->belongsTo(Product::class);
	}
}
