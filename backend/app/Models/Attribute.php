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
 * Class Attribute
 * 
 * @property int $id
 * @property string $name
 * @property string $attribute_type
 * @property string $data_type
 * @property string|null $unit
 * @property bool $is_filterable
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property Collection|Category[] $categories
 * @property Collection|Product[] $products
 *
 * @package App\Models
 */
class Attribute extends Model
{
	use SoftDeletes;
	protected $table = 'attributes';

	protected $casts = [
		'is_filterable' => 'bool'
	];

	protected $fillable = [
		'name',
		'attribute_type',
		'data_type',
		'unit',
		'is_filterable'
	];

	public function categories()
	{
		return $this->belongsToMany(Category::class, 'category_attributes')
					->withPivot('used_for_variant', 'deleted_at')
					->withTimestamps();
	}

	public function products()
	{
		return $this->belongsToMany(Product::class, 'product_attribute_values')
					->withPivot('value', 'deleted_at')
					->withTimestamps();
	}
}
