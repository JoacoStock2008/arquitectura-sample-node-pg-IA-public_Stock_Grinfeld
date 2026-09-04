import { StatusCodes } from 'http-status-codes';

export function responderOk(res, data) {

    return res
        .status(StatusCodes.OK)
        .json(data);
}

export function responderCreated(res, data) {

    return res
        .status(StatusCodes.CREATED)
        .json(data);
}

export function responderNotFound(res, id) {

    return res
        .status(StatusCodes.NOT_FOUND)
        .send(`No se encontro la entidad (id:${id}).`);
}

export function responderBadRequest(res, mensaje) {

    return res
        .status(StatusCodes.BAD_REQUEST)
        .send(mensaje);
}

export function responderError(res, error) {

    // El error completo queda solamente en el servidor.
    console.log(error);

    // Los errores que nosotros generamos son seguros para mostrar.
    if (error?.operational === true) {
        return res
            .status(error.statusCode)
            .send(error.message);
    }

    // Nunca enviamos errores internos de PostgreSQL, stack traces, etc.
    return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(`Error interno.`);
}