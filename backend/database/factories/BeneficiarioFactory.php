<?php

namespace Database\Factories;

use App\Models\Beneficiario;
use Illuminate\Database\Eloquent\Factories\Factory;

class BeneficiarioFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Beneficiario::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'nome_completo' =>$this->faker->name(),
            'cpf' => $this->faker->cpf(false),
            'data_nascimento' => $this->faker->date('Y-m-d'),
            'nome_pai' => $this->faker->name(),
            'nome_mae' => $this->faker->name(),
            'nome_responsavel' =>  $this->faker->name(),
            'telefone' => $this->faker->landlineNumber(false),
            'celular' => $this->faker->cellphoneNumber(false),
            'email' => $this->faker->unique()->safeEmail(),
            'nucleo_id' => $this->faker->numberBetween(1,10),

            'created_at' => now(),
            'updated_at' => now()
            
        ];
    }
}
