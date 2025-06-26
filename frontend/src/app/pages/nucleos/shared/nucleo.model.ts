import { Municipio } from "./municipio.model";

export class Nucleo {
    constructor(
        public id?: number,
        public municipio_id?: string,
        public comar_id?: any,
        public municipio?: Municipio,
        public descricao?: string,
        public dias_turnos?: any,
        public regiao?: any,
        public uf?: string,
        public dia_turno_nucleos?: any,
        public created_at?: any,
        public updated_at?: any,
    ) { }



}

