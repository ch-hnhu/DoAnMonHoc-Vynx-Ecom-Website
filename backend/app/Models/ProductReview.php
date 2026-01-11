<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class ProductReview
 *
 * @property int $id
 * @property int $product_id
 * @property int $user_id
 * @property int $order_id
 * @property int $rating
 * @property string $content
 * @property string|null $review_reply
 * @property int|null $review_reply_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 *
 * @property Order $order
 * @property Product $product
 * @property User $user
 *
 * @package App\Models
 */
class ProductReview extends Model
{
	use HasFactory, SoftDeletes;
	protected $table = 'product_reviews';

	protected $casts = [
		'product_id' => 'int',
		'user_id' => 'int',
		'order_id' => 'int',
		'rating' => 'int',
		'review_reply_by' => 'int'
	];

	protected $fillable = [
		'product_id',
		'user_id',
		'order_id',
		'rating',
		'content',
		'review_reply',
		'review_reply_by'
	];

	public function order()
	{
		return $this->belongsTo(Order::class);
	}

	public function product()
	{
		return $this->belongsTo(Product::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
