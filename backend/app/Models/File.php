<?php

namespace App\Models;
use JWTAuth;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;

    protected $table = 'files';
    protected $fillable = [
        'name',
        'path',
        'url',
        'mime_type',
        'size',
    ];


}
