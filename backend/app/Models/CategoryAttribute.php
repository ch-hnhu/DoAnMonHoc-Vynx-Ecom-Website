<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class CategoryAttribute
 * 
 * @property int $category_id
 * @property int $attribute_id
 * @property bool $used_for_variant
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property Attribute $attribute
 * @property Category $category
 *
 * @package App\Models
 */
class CategoryAttribute extends Model
{
	use SoftDeletes;
	protected $table = 'category_attributes';
	public $incrementing = false;

	protected $casts = [
		'category_id' => 'int',
		'attribute_id' => 'int',
		'used_for_variant' => 'bool'
	];

	protected $fillable = [
		'used_for_variant'
	];

	public function attribute()
	{
		return $this->belongsTo(Attribute::class);
	}

	public function category()
	{
		return $this->belongsTo(Category::class);
	}
}
