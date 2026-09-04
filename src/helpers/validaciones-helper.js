import { StatusCodes } from 'http-status-codes';
import { AppError } from './errores-helper.js';

export function validarEntidadExiste(entity, mensaje) {

    if (entity == null) {
        throw new AppError(
            mensaje,
            StatusCodes.NOT_FOUND
        );
    }

}

export function validarSinConflicto(entity, mensaje) {

    if (entity != null) {
        throw new AppError(
            mensaje,
            StatusCodes.CONFLICT
        );
    }

}

export function validarNota(nota) {

    if (nota < 1 || nota > 10) {
        throw new AppError(
            `La nota debe estar entre 1 y 10 inclusive.`,
            StatusCodes.BAD_REQUEST
        );
    }

}