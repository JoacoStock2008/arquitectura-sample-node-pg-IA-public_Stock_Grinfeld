import { Router } from 'express';

import AlumnosService from './../services/alumnos-service.js';
import Alumno from './../entities/alumno.js';

import {
    validarIdParam,
    validarIdBodyCoincide,
    validarAlumnoCrear,
    validarAlumnoActualizar
} from './../middlewares/validaciones-middleware.js';

import {
    responderOk,
    responderCreated,
    responderNotFound,
    responderBadRequest,
    responderError
} from './../helpers/respuestas-helper.js';

const router = Router();
const currentService = new AlumnosService();

router.get('/test-insert', async (req, res) => {

    try {

        const nuevoAlumno = new Alumno(
            'Willy',
            'Wonka',
            1,
            '2005-07-15',
            true
        );

        const newId =
            await currentService.createAsync(nuevoAlumno);

        if (newId > 0) {
            return responderCreated(res, {
                message: `Se creó el alumno desde código con id: ${newId}`,
                alumno: nuevoAlumno,
                newId: newId
            });
        }

        return responderBadRequest(
            res,
            `No se pudo crear el alumno.`
        );

    } catch (error) {

        return responderError(
            res,
            error
        );
    }
});

router.get('', async (req, res) => {

    try {

        const returnArray =
            await currentService.getAllAsync();

        return responderOk(
            res,
            returnArray
        );

    } catch (error) {

        return responderError(
            res,
            error
        );
    }
});

router.get(
    '/:id',
    validarIdParam,
    async (req, res) => {

        try {

            const id = req.params.id;

            const returnEntity =
                await currentService.getByIdAsync(id);

            if (returnEntity == null) {
                return responderNotFound(
                    res,
                    id
                );
            }

            return responderOk(
                res,
                returnEntity
            );

        } catch (error) {

            return responderError(
                res,
                error
            );
        }
    }
);

router.post(
    '',
    validarAlumnoCrear,
    async (req, res) => {

        try {

            const entity = req.body;

            const newId =
                await currentService.createAsync(entity);

            return responderCreated(
                res,
                newId
            );

        } catch (error) {

            return responderError(
                res,
                error
            );
        }
    }
);

router.put(
    '/:id',
    validarIdParam,
    validarAlumnoActualizar,
    validarIdBodyCoincide,
    async (req, res) => {

        try {

            const id = req.params.id;
            const entity = req.body;

            entity.id = id;

            const rowsAffected =
                await currentService.updateAsync(entity);

            if (rowsAffected === 0) {
                return responderNotFound(
                    res,
                    id
                );
            }

            return responderOk(
                res,
                rowsAffected
            );

        } catch (error) {

            return responderError(
                res,
                error
            );
        }
    }
);

router.delete(
    '/:id',
    validarIdParam,
    async (req, res) => {

        try {

            const id = req.params.id;

            const rowCount =
                await currentService.deleteByIdAsync(id);

            if (rowCount === 0) {
                return responderNotFound(
                    res,
                    id
                );
            }

            return responderOk(
                res,
                null
            );

        } catch (error) {

            return responderError(
                res,
                error
            );
        }
    }
);

export default router;