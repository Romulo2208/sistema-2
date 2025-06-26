<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class UniformeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'tamanho_camisa'=>"required",
            'tamanho_calca'=>"required",
            'tamanho_tenis'=>"required",
            'tamanho_abrigo'=>"required",
            'tamanho_short'=>"required",
           
            
        ];
    }

    public function messages()
    {
        return [
            "tamanho_calca.required"=>"O campo tamanho da calça é obrigatório."
        ];
    }

    public function failedValidation(Validator $validator)
    {
      throw new HttpResponseException(response()->json([
            'error'      => $validator->errors()->first(),
            'errors'     => $validator->errors()
        ],400));
    }
}
