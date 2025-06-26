<?php

namespace Database\Factories;

use App\Models\Nucleo;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class NucleoFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Nucleo::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        static $number = 1;
        return [
            'descricao' => "Núcleo da Ala".  $number++,
            'municipio_id' => $this->faker->numberBetween(1,5570),
            'comar_id' => $this->faker->numberBetween(1,7),
            'created_at' => Carbon::now(),
            'updated_at' =>  Carbon::now()
            
        ];
    }
}
