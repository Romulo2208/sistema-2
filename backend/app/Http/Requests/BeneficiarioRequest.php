<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use App\Rules\Cpf;

class BeneficiarioRequest extends FormRequest
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

        $beneficiario=$this->route('beneficiario');
       // dd($beneficiario);
        $id=$beneficiario?$beneficiario->id:'null';
        $ruleEmail= request('email')?"email":"";
        $ruleCpf= ["required", new Cpf(), "unique:beneficiarios,cpf,$id"];

        return [
            'nome_completo'=>"required",
            'nucleo_id'=>"required",
            'escola_id'=>"required",
            'data_nascimento'=>"required|date_format:Y-m-d",
            'email'=>$ruleEmail,
            'cpf'=>$ruleCpf,
            'serie_id' => 'nullable|exists:series,id',
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
