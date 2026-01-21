<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Order
 *
 * @property int $id
 * @property int $user_id
 * @property int|null $promotion_id
 * @property int $address_id
 * @property float $subtotal_amount
 * @property float $discount_amount
 * @property float $shipping_fee
 * @property float $total_amount
 * @property string $payment_method
 * @property string $payment_status
 * @property string $delivery_method
 * @property string $delivery_status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property UserAddress $user_address
 * @property Promotion|null $promotion
 * @property User $user
 * @property Collection|OrderItem[] $order_items
 * @property Collection|ProductReview[] $product_reviews
 *
 * @package App\Models
 */
class Order extends Model
{
	use HasFactory, SoftDeletes;
	protected $table = 'orders';

	protected $casts = [
		'user_id' => 'int',
		'promotion_id' => 'int',
		'address_id' => 'int',
		'subtotal_amount' => 'float',
		'discount_amount' => 'float',
		'shipping_fee' => 'float',
		'total_amount' => 'float'
	];

	protected $fillable = [
		'user_id',
		'promotion_id',
		'address_id',
		'subtotal_amount',
		'discount_amount',
		'shipping_fee',
		'total_amount',
		'payment_method',
		'payment_status',
		'delivery_method',
		'delivery_status',
		'shipping_name',
		'shipping_phone',
		'shipping_email',
		'shipping_address',
		'shipping_note'
	];

	public function user_address()
	{
		return $this->belongsTo(UserAddress::class, 'address_id');
	}

	public function promotion()
	{
		return $this->belongsTo(Promotion::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function order_items()
	{
		return $this->hasMany(OrderItem::class);
	}

	public function product_reviews()
	{
		return $this->hasMany(ProductReview::class);
	}
}
