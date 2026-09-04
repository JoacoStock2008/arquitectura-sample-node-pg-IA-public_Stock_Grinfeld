import { responderBadRequest } from '../helpers/respuestas-helper.js';
import { esFechaValida } from '../helpers/fechas-helper.js';

function esEnteroPositivo(valor) {

    return (
        Number.isInteger(valor) &&
        valor > 0
    );
}

function esTextoValido(valor) {

    return (
        typeof valor === 'string' &&
        valor.trim().length > 0
    );
}

function validarBody({
    camposPermitidos,
    camposObligatorios = [],
    reglas,
    requiereAlMenosUnCampo = false
}) {

    return (req, res, next) => {

        const body = req.body;

        if (
            body == null ||
            typeof body !== 'object' ||
            Array.isArray(body)
        ) {
            return responderBadRequest(
                res,
                `El body debe ser un objeto JSON válido.`
            );
        }

        const camposRecibidos = Object.keys(body);

        const campoNoPermitido = camposRecibidos.find(
            campo => !camposPermitidos.includes(campo)
        );

        if (campoNoPermitido) {
            return responderBadRequest(
                res,
                `El campo '${campoNoPermitido}' no es válido.`
            );
        }

        for (const campo of camposObligatorios) {

            if (
                body[campo] === undefined ||
                body[campo] === null
            ) {
                return responderBadRequest(
                    res,
                    `El campo '${campo}' es obligatorio.`
                );
            }

        }

        if (requiereAlMenosUnCampo) {

            const camposModificables = camposRecibidos.filter(
                campo => campo !== 'id'
            );

            if (camposModificables.length === 0) {
                return responderBadRequest(
                    res,
                    `Debe enviar al menos un campo para modificar.`
                );
            }

        }

        for (const campo of camposRecibidos) {

            const regla = reglas[campo];

            if (!regla) continue;

            const mensajeError = regla(body[campo]);

            if (mensajeError != null) {
                return responderBadRequest(
                    res,
                    mensajeError
                );
            }

        }

        next();
    };

}

export function validarIdParam(req, res, next) {

    const idTexto = req.params.id;

    if (!/^\d+$/.test(idTexto)) {
        return responderBadRequest(
            res,
            `El id debe ser un número entero positivo.`
        );
    }

    const id = Number(idTexto);

    if (!esEnteroPositivo(id)) {
        return responderBadRequest(
            res,
            `El id debe ser un número entero positivo.`
        );
    }

    req.params.id = id;

    next();
}

export function validarIdBodyCoincide(req, res, next) {

    const idUrl = req.params.id;
    const idBody = req.body?.id;

    if (idBody === undefined) {
        return next();
    }

    if (!esEnteroPositivo(idBody)) {
        return responderBadRequest(
            res,
            `El id del body debe ser un número entero positivo.`
        );
    }

    if (idBody !== idUrl) {
        return responderBadRequest(
            res,
            `El id de la URL (${idUrl}) no coincide con el id del body (${idBody}).`
        );
    }

    next();
}


// -----------------------------------------------------
// ALUMNOS
// -----------------------------------------------------

const reglasAlumno = {

    id: valor => {

        if (!esEnteroPositivo(valor)) {
            return `El id debe ser un número entero positivo.`;
        }

        return null;
    },

    nombre: valor => {

        if (!esTextoValido(valor)) {
            return `El nombre debe ser un texto no vacío.`;
        }

        return null;
    },

    apellido: valor => {

        if (!esTextoValido(valor)) {
            return `El apellido debe ser un texto no vacío.`;
        }

        return null;
    },

    id_curso: valor => {

        if (!esEnteroPositivo(valor)) {
            return `El id_curso debe ser un número entero positivo.`;
        }

        return null;
    },

    fecha_nacimiento: valor => {

        if (!esFechaValida(valor)) {
            return `La fecha_nacimiento debe tener formato YYYY-MM-DD y ser una fecha válida.`;
        }

        return null;
    },

    hace_deportes: valor => {

        if (typeof valor !== 'boolean') {
            return `El campo hace_deportes debe ser booleano.`;
        }

        return null;
    }

};

export const validarAlumnoCrear = validarBody({

    camposPermitidos: [
        'nombre',
        'apellido',
        'id_curso',
        'fecha_nacimiento',
        'hace_deportes'
    ],

    camposObligatorios: [
        'nombre',
        'apellido',
        'id_curso',
        'fecha_nacimiento',
        'hace_deportes'
    ],

    reglas: reglasAlumno

});

export const validarAlumnoActualizar = validarBody({

    camposPermitidos: [
        'id',
        'nombre',
        'apellido',
        'id_curso',
        'fecha_nacimiento',
        'hace_deportes'
    ],

    reglas: reglasAlumno,

    requiereAlMenosUnCampo: true

});


// -----------------------------------------------------
// CALIFICACIONES
// -----------------------------------------------------

const reglasCalificacion = {

    id: valor => {

        if (!esEnteroPositivo(valor)) {
            return `El id debe ser un número entero positivo.`;
        }

        return null;
    },

    id_alumno: valor => {

        if (!esEnteroPositivo(valor)) {
            return `El id_alumno debe ser un número entero positivo.`;
        }

        return null;
    },

    id_materia: valor => {

        if (!esEnteroPositivo(valor)) {
            return `El id_materia debe ser un número entero positivo.`;
        }

        return null;
    },

    nota: valor => {

        if (typeof valor !== 'number' || Number.isNaN(valor)) {
            return `La nota debe ser un número.`;
        }

        return null;
    },

    fecha: valor => {

        if (!esFechaValida(valor)) {
            return `La fecha debe tener formato YYYY-MM-DD y ser una fecha válida.`;
        }

        return null;
    }

};

export const validarCalificacionCrear = validarBody({

    camposPermitidos: [
        'id_alumno',
        'id_materia',
        'nota',
        'fecha'
    ],

    camposObligatorios: [
        'id_alumno',
        'id_materia',
        'nota',
        'fecha'
    ],

    reglas: reglasCalificacion

});

export const validarCalificacionActualizar = validarBody({

    camposPermitidos: [
        'id',
        'id_alumno',
        'id_materia',
        'nota',
        'fecha'
    ],

    reglas: reglasCalificacion,

    requiereAlMenosUnCampo: true

});