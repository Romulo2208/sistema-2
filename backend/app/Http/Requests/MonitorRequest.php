<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class MonitorRequest extends FormRequest
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
        $monitor=$this->route('monitor'); //route disponível em edição
        $id=$monitor?$monitor->id:'null';; //usado para permitir edição


        return [
            'nome'              => 'required',
            "cpf"          => "required|max:255|unique:monitors,cpf,$id",
            "email"          => "required|max:255|unique:monitors,email,$id",
           
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
