<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Slideshow
 * 
 * @property int $id
 * @property string $title
 * @property string $image_url
 * @property string|null $link_url
 * @property int $position
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 *
 * @package App\Models
 */
class Slideshow extends Model
{
	use SoftDeletes;
	protected $table = 'slideshows';

	protected $casts = [
		'position' => 'int'
	];

	protected $fillable = [
		'title',
		'image_url',
		'link_url',
		'position'
	];
}
