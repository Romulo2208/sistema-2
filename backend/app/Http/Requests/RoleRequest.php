<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class RoleRequest extends FormRequest
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
        $role=$this->route('role');
        $id=$role?$role->id:'null'; //exceção do unique para poder editar
        return [
            'slug'               => "required|max:255|unique:roles,slug,$id",
            'name'               => "required|max:255|unique:roles,name,$id",
            'description'        => 'required',
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
