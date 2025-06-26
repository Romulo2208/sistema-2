<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class NucleoRequest extends FormRequest
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
            'descricao'=>"required",
            'municipio_id'=>"required",
            'comar_id'=>"required",
            // 'dia_turno_id'  => 'required',//verificar a possibilidade de um custom validator para verificar a estrutura do json
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
