<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Blog extends Model
{
	use HasFactory, SoftDeletes;

	protected $table = 'blogs';

	protected $fillable = [
		'author_name',
		'title',
		'image_url',
		'content',
		'published_at',
		'is_active',
	];
}