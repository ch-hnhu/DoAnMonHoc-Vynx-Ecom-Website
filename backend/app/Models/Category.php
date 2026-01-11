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
 * Class Category
 *
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property int|null $parent_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 *
 * @property Category|null $category
 * @property Collection|Category[] $categories
 * @property Collection|Attribute[] $attributes
 * @property Collection|Product[] $products
 *
 * @package App\Models
 */
class Category extends Model
{
	use HasFactory, SoftDeletes;
	protected $table = 'categories';

	protected $casts = [
		'parent_id' => 'int'
	];

	protected $fillable = [
		'name',
		'slug',
		'description',
		'parent_id'
	];

	public function category()
	{
		return $this->belongsTo(Category::class, 'parent_id');
	}

	public function categories()
	{
		return $this->hasMany(Category::class, 'parent_id');
	}

	public function attributes()
	{
		return $this->belongsToMany(Attribute::class, 'category_attributes')
			->withPivot('used_for_variant', 'deleted_at')
			->withTimestamps();
	}

	public function products()
	{
		return $this->hasMany(Product::class);
	}
}
