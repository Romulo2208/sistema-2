import { Municipio } from "../../nucleos/shared/municipio.model";

export class Escola {
    constructor(
        id: number,
        nome: string ,
        localidade: string,
        pais: string,
        regiao: string,
        uf: string,
        municipio: Municipio,
        categoria_zona?: string,
        categoria_tipo?: string
    ) { }



}

