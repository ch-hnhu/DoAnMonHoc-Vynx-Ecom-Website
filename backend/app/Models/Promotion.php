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
 * Class Promotion
 * 
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string|null $description
 * @property string $discount_type
 * @property float $discount_value
 * @property Carbon $start_date
 * @property Carbon $end_date
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property Collection|Order[] $orders
 * @property Collection|Product[] $products
 *
 * @package App\Models
 */
class Promotion extends Model
{
	use SoftDeletes;
	protected $table = 'promotions';

	protected $casts = [
		'discount_value' => 'float',
		'start_date' => 'datetime',
		'end_date' => 'datetime'
	];

	protected $fillable = [
		'code',
		'name',
		'description',
		'discount_type',
		'discount_value',
		'start_date',
		'end_date'
	];

	public function orders()
	{
		return $this->hasMany(Order::class);
	}

	public function products()
	{
		return $this->hasMany(Product::class);
	}
}
