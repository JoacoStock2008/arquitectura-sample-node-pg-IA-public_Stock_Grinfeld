import { StatusCodes } from 'http-status-codes';
import { AppError } from './errores-helper.js';

export function esFechaValida(fecha) {

    if (typeof fecha !== 'string') {
        return false;
    }

    const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;

    if (!formatoFecha.test(fecha)) {
        return false;
    }

    const [anio, mes, dia] = fecha
        .split('-')
        .map(Number);

    const fechaCreada = new Date(
        anio,
        mes - 1,
        dia
    );

    return (
        fechaCreada.getFullYear() === anio &&
        fechaCreada.getMonth() === mes - 1 &&
        fechaCreada.getDate() === dia
    );
}

export function validarFechaNacimiento(fecha) {

    if (!esFechaValida(fecha)) {
        throw new AppError(
            `La fecha de nacimiento no es válida.`,
            StatusCodes.BAD_REQUEST
        );
    }

    const [anio, mes, dia] = fecha
        .split('-')
        .map(Number);

    const fechaNacimiento = new Date(
        anio,
        mes - 1,
        dia
    );

    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);

    if (fechaNacimiento > hoy) {
        throw new AppError(
            `La fecha de nacimiento no puede ser futura.`,
            StatusCodes.BAD_REQUEST
        );
    }

}

export function validarFechaCalificacion(fecha) {

    if (!esFechaValida(fecha)) {
        throw new AppError(
            `La fecha de la calificación no es válida.`,
            StatusCodes.BAD_REQUEST
        );
    }

    const [anio, mes, dia] = fecha
        .split('-')
        .map(Number);

    const fechaCalificacion = new Date(
        anio,
        mes - 1,
        dia
    );

    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);

    if (anio !== hoy.getFullYear()) {
        throw new AppError(
            `La fecha de la calificación debe pertenecer al año actual.`,
            StatusCodes.BAD_REQUEST
        );
    }

    if (fechaCalificacion > hoy) {
        throw new AppError(
            `La fecha de la calificación no puede ser futura.`,
            StatusCodes.BAD_REQUEST
        );
    }

}

export function calcularEdad(fechaNacimiento) {

    if (!fechaNacimiento) return null;

    const [anio, mes, dia] = fechaNacimiento
        .split('-')
        .map(Number);

    const nacimiento = new Date(
        anio,
        mes - 1,
        dia
    );

    const hoy = new Date();

    let edad =
        hoy.getFullYear() -
        nacimiento.getFullYear();

    const mesDiff =
        hoy.getMonth() -
        nacimiento.getMonth();

    if (
        mesDiff < 0 ||
        (
            mesDiff === 0 &&
            hoy.getDate() < nacimiento.getDate()
        )
    ) {
        edad--;
    }

    return edad;
}

export function agregarEdad(alumno) {

    if (!alumno) return alumno;

    return {
        ...alumno,
        edad: calcularEdad(alumno.fecha_nacimiento)
    };
}