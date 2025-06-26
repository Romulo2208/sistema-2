<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class UserRequest extends FormRequest
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
        $user=$this->route('user'); //route disponível em edição
        $id=$user?$user->id:'null';; //usado para permitir edição

        
        $rulePassword= request('password')?"required|confirmed|string|min:6":"";

        return [
            'name'              => 'required|string|max:255',
            "email"             => "required|email|max:255|unique:users,email,$id",
            "username"          => "required|max:255|unique:users,username,$id",
            "password"          => $rulePassword,
            //'confirmPassword'   => 'required_with:password|same:password|min:6'
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
