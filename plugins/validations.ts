/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck

export default (context, inject) => {
    const validations = {
        notEmpty(value: String) {
            return value !== '' || 'El campo es obligatorio'
        },
        notNumber(value: String) {
            return !isNaN(Number(value)) || 'Solo se admiten números'
        },
        notPhone(value: String) {
            if(value.length!==0){
                if((value.length!==10 || isNaN(Number(value)))){
                    return 'El número de telefono solo debe contener números y tener solo 10 digitos'
                }
            }
        },
        isValidEmail(value: String) {
            return value.match(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/) instanceof Object || "El email es inválido"
        },
    }

    inject('validations',validations)
}