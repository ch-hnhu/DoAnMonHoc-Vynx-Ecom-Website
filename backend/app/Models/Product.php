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
 * Class Product
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property float $price
 * @property string|null $image_url
 * @property int $category_id
 * @property int $brand_id
 * @property int|null $promotion_id
 * @property int $stock_quantity
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 *
 * @property Brand $brand
 * @property Category $category
 * @property Promotion|null $promotion
 * @property Collection|CartItem[] $cart_items
 * @property Collection|OrderItem[] $order_items
 * @property Collection|Attribute[] $attributes
 * @property Collection|ProductReview[] $product_reviews
 *
 * @package App\Models
 */
class Product extends Model
{
	use HasFactory, SoftDeletes;
	protected $table = 'products';

	protected $casts = [
		'price' => 'float',
		'image_url' => 'array',
		'category_id' => 'int',
		'brand_id' => 'int',
		'promotion_id' => 'int',
		'stock_quantity' => 'int'
	];

	protected $fillable = [
		'name',
		'slug',
		'description',
		'price',
		'image_url',
		'category_id',
		'brand_id',
		'promotion_id',
		'stock_quantity'
	];

	public function brand()
	{
		return $this->belongsTo(Brand::class);
	}

	public function category()
	{
		return $this->belongsTo(Category::class);
	}

	public function promotion()
	{
		return $this->belongsTo(Promotion::class);
	}

	public function cart_items()
	{
		return $this->hasMany(CartItem::class);
	}

	public function order_items()
	{
		return $this->hasMany(OrderItem::class);
	}

	public function attributes()
	{
		return $this->belongsToMany(Attribute::class, 'product_attribute_values')
			->withPivot('value', 'deleted_at')
			->withTimestamps();
	}
	public function specifications()
	{
		return $this->belongsToMany(Attribute::class, 'product_attribute_values')
			->where('attributes.attribute_type', 'specification')
			->whereNull('product_attribute_values.deleted_at')
			->withPivot('value')
			->withTimestamps();
	}

	public function product_reviews()
	{
		return $this->hasMany(ProductReview::class);
	}

	public function wishlists()
	{
		return $this->hasMany(Wishlist::class);
	}
}
