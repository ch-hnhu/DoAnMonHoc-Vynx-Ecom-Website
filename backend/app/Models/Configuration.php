<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Configuration
 * 
 * @property int $id
 * @property string|null $logo
 * @property string $name
 * @property string $email
 * @property string $phone
 * @property string $address
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */
class Configuration extends Model
{
	protected $table = 'configurations';

	protected $casts = [
		'is_active' => 'bool'
	];

	protected $fillable = [
		'logo',
		'name',
		'email',
		'phone',
		'address',
		'is_active'
	];
}
