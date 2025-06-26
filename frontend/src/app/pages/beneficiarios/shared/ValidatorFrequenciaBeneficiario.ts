import { AbstractControl } from "@angular/forms";

export function frequenciaValidator(control: AbstractControl) {

    //regra:
    /**
     *  so pode 1 ou 2 - segunda
     *  so pode 3 ou 4 - terca
     *  so pode 5 ou 6 - quarta
     *  so pode 7 ou 8 - quinta
     *  so pode 9 ou 10 - sexta
     */

    const SEGUNDA_MANHA = 1;
    const SEGUNDA_TARDE = 2;
    const TERCA_MANHA   = 3;
    const TERCA_TARDE   = 4;
    const QUARTA_MANHA  = 5;
    const QUARTA_TARDE  = 6;
    const QUINTA_MANHA  = 7;
    const QUINTA_TARDE  = 8;
    const SEXTA_MANHA   = 9;
    const SEXTA_TARDE   = 10;

    
    const list_frequencia = control.value;

    if(list_frequencia && list_frequencia.length > 0){

        if(list_frequencia.indexOf(SEGUNDA_MANHA) !== -1 && list_frequencia.indexOf(SEGUNDA_TARDE) !== -1){
            return { frequencia: true, msg:"Verifique a segunda-feira!" };
        }else if(list_frequencia.indexOf(TERCA_MANHA) !== -1 && list_frequencia.indexOf(TERCA_TARDE) !== -1){
            return { frequencia: true, msg:"Verifique a terça-feira!" };
        }else if(list_frequencia.indexOf(QUARTA_MANHA) !== -1 && list_frequencia.indexOf(QUARTA_TARDE) !== -1){
            return { frequencia: true, msg:"Verifique a quarta-feira!" };
        }else if(list_frequencia.indexOf(QUINTA_MANHA) !== -1 && list_frequencia.indexOf(QUINTA_TARDE) !== -1){
            return { frequencia: true, msg:"Verifique a quinta-feira!" };
        }else if(list_frequencia.indexOf(SEXTA_MANHA) !== -1 && list_frequencia.indexOf(SEXTA_TARDE) !== -1){
            return { frequencia: true, msg:"Verifique a sexta-feira!" };
        }
    
    }


    //passou miserviiis
    return null;
}
