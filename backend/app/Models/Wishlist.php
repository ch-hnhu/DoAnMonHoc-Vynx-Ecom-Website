<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Wishlist
 *
 * @property int $id
 * @property int $user_id
 * @property int $product_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 *
 * @property User $user
 * @property Product $product
 *
 * @package App\Models
 */
class Wishlist extends Model
{
	use HasFactory, SoftDeletes;

	protected $table = 'wishlists';

	protected $primaryKey = ['user_id', 'product_id'];
	public $incrementing = false;
	protected $keyType = 'int';

	protected $casts = [
		'user_id' => 'int',
		'product_id' => 'int',
	];

	protected $fillable = [
		'user_id',
		'product_id'
	];

	/**
	 * Set the keys for a save update query.
	 */
	protected function setKeysForSaveQuery($query)
	{
		$keys = $this->getKeyName();
		if (!is_array($keys)) {
			return parent::setKeysForSaveQuery($query);
		}

		foreach ($keys as $keyName) {
			$query->where($keyName, '=', $this->getKeyForSaveQuery($keyName));
		}

		return $query;
	}

	/**
	 * Get the value for a given key.
	 */
	protected function getKeyForSaveQuery($keyName = null)
	{
		if (is_null($keyName)) {
			$keyName = $this->getKeyName();
		}

		if (isset($this->original[$keyName])) {
			return $this->original[$keyName];
		}

		return $this->getAttribute($keyName);
	}

	/**
	 * Perform the actual delete query on this model instance.
	 */
	protected function performDeleteOnModel()
	{
		if ($this->forceDeleting) {
			return $this->newModelQuery()->where($this->getKeyName(), $this->getKey())->forceDelete();
		}

		return $this->runSoftDelete();
	}

	/**
	 * Get the user that owns the wishlist item
	 */
	public function user()
	{
		return $this->belongsTo(User::class);
	}

	/**
	 * Get the product in the wishlist
	 */
	public function product()
	{
		return $this->belongsTo(Product::class);
	}
}
