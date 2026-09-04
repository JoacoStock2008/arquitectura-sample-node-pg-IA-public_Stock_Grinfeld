import { StatusCodes } from 'http-status-codes';

export function responderOk(res, data) {
    return res.status(StatusCodes.OK).json(data);
}

export function responderCreated(res, data) {
    return res.status(StatusCodes.CREATED).json(data);
}

export function responderNotFound(res, id) {
    return res
        .status(StatusCodes.NOT_FOUND)
        .send(`No se encontro la entidad (id:${id}).`);
}

export function responderBadRequest(res, data = null) {
    return res.status(StatusCodes.BAD_REQUEST).json(data);
}

export function responderBadRequestTexto(res, mensaje) {
    return res.status(StatusCodes.BAD_REQUEST).send(mensaje);
}

export function responderError(res, error) {
    console.log(error);

    return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(`Error: ${error.message}`);
}

export function responderErrorBadRequest(res, error) {
    console.log(error);

    return res
        .status(StatusCodes.BAD_REQUEST)
        .send(`Error: ${error.message}`);
}

export function responderErrorInterno(res) {
    return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(`Error interno.`);
}