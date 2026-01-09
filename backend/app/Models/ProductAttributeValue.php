<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class ProductAttributeValue
 * 
 * @property int $product_id
 * @property int $attribute_id
 * @property string $value
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property Attribute $attribute
 * @property Product $product
 *
 * @package App\Models
 */
class ProductAttributeValue extends Model
{
	use SoftDeletes;
	protected $table = 'product_attribute_values';
	public $incrementing = false;

	protected $casts = [
		'product_id' => 'int',
		'attribute_id' => 'int'
	];

	protected $fillable = [
		'value'
	];

	public function attribute()
	{
		return $this->belongsTo(Attribute::class);
	}

	public function product()
	{
		return $this->belongsTo(Product::class);
	}
}
