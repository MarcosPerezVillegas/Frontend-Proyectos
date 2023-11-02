/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck

export default (context, inject) => {
    const validations = {
        notEmpty(value: String) {
            return value !== '' && value !== null || 'El campo es obligatorio';
        },
        notNumber(value) {
            const number = Number(value);
            if (!isNaN(number) && Number.isInteger(number) && number >= 0) {
                return true; // Es un número entero mayor o igual a 1
            } else {
                return 'Solo se admiten números enteros mayores o iguales a 1';
            }
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
        
        isFileLessThan50MB(file) {
            const maxSize = 50 * 1024 * 1024; // Tamaño máximo en bytes (50MB)
            if(!file) return
            return file?.size <= maxSize || 'El archivo no debe ser mayor a 50MB';
        },
        isFileLessThan10MB(file) {
            const maxSize = 10 * 1024 * 1024; // Tamaño máximo en bytes (10MB)
            if(!file) return
            return file?.size <= maxSize || 'El archivo no debe ser mayor a 10MB';
        },
    }

    inject('validations',validations)
}