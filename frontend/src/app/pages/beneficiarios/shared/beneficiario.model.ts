import { Escola } from "../../escolas/shared/escola.model";
import { Nucleo } from "../../nucleos/shared/nucleo.model";
import { Deficiencia } from "./deficiencia.model";
import { Endereco } from "./endereco.model";
import { Uniforme } from "./uniforme.model";

export class Beneficiario {
    constructor(

        public id?: number,
        public nome_completo?: string,
        public cpf?: string,
        public data_nascimento?: string,
        public nome_pai?: string,
        public nome_mae?: string,
        public nome_responsavel?: string,
        public telefone?: string,
        public celular?: string,
        public email?: string,
        public nucleo_id?: Nucleo,
        public deficiencias_id?: number[] | any,
        public justificativa?: string,
        public serie_id?: string,
        public endereco?: Endereco,
        public deficiencias?: Deficiencia[] | any,
        public nucleo?:Nucleo,
        public uniforme?:Uniforme,
        public escola?: Escola,
        public pjp?: boolean,

        

        public created_at?: any,
        public updated_at?: any,
    ) { }

}

