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
 * Class UserAddress
 * 
 * @property int $id
 * @property int $user_id
 * @property string $recipient_name
 * @property string $phone
 * @property string $address_line
 * @property string $ward
 * @property string $district
 * @property string $province
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property User $user
 * @property Collection|Order[] $orders
 *
 * @package App\Models
 */
class UserAddress extends Model
{
	use SoftDeletes;
	protected $table = 'user_addresses';

	protected $casts = [
		'user_id' => 'int'
	];

	protected $fillable = [
		'user_id',
		'recipient_name',
		'phone',
		'address_line',
		'ward',
		'district',
		'province'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function orders()
	{
		return $this->hasMany(Order::class, 'address_id');
	}
}
