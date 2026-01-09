<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class SupportRequest
 * 
 * @property int $id
 * @property string $full_name
 * @property string $email
 * @property string|null $phone
 * @property string $content
 * @property string $status
 * @property int|null $supported_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property User|null $user
 *
 * @package App\Models
 */
class SupportRequest extends Model
{
	use SoftDeletes;
	protected $table = 'support_requests';

	protected $casts = [
		'supported_by' => 'int'
	];

	protected $fillable = [
		'full_name',
		'email',
		'phone',
		'content',
		'status',
		'supported_by'
	];

	public function user()
	{
		return $this->belongsTo(User::class, 'supported_by');
	}
}
