import CalificacionesRepository from '../repositories/calificaciones-repository.js';
import AlumnosService from './alumnos-service.js';
import MateriasService from './materias-service.js';

import {
    validarFechaCalificacion
} from '../helpers/fechas-helper.js';

import {
    validarEntidadExiste,
    validarSinConflicto,
    validarNota
} from '../helpers/validaciones-helper.js';

export default class CalificacionesService {

    constructor() {
        console.log(
            'Estoy en: CalificacionesService.constructor()'
        );

        this.CalificacionesRepository =
            new CalificacionesRepository();

        this.AlumnosService =
            new AlumnosService();

        this.MateriasService =
            new MateriasService();
    }

    getAllAsync = async () => {
        console.log(
            `CalificacionesService.getAllAsync()`
        );

        const returnArray =
            await this.CalificacionesRepository.getAllAsync();

        return returnArray;
    }

    getByIdAsync = async (id) => {
        console.log(
            `CalificacionesService.getByIdAsync(${id})`
        );

        const returnEntity =
            await this.CalificacionesRepository.getByIdAsync(id);

        return returnEntity;
    }

    createAsync = async (entity) => {
        console.log(
            `CalificacionesService.createAsync(${JSON.stringify(entity)})`
        );

        await this.validarAlumnoExiste(
            entity.id_alumno
        );

        await this.validarMateriaExiste(
            entity.id_materia
        );

        validarNota(
            entity.nota
        );

        validarFechaCalificacion(
            entity.fecha
        );

        await this.validarCalificacionNoExiste(
            entity.id_alumno,
            entity.id_materia
        );

        const rowsAffected =
            await this.CalificacionesRepository.createAsync(entity);

        return rowsAffected;
    }

    updateAsync = async (entity) => {
        console.log(
            `CalificacionesService.updateAsync(${JSON.stringify(entity)})`
        );

        const previousEntity =
            await this.CalificacionesRepository.getByIdAsync(
                entity.id
            );

        if (previousEntity == null) {
            return 0;
        }

        const idAlumno =
            entity?.id_alumno ??
            previousEntity.id_alumno;

        const idMateria =
            entity?.id_materia ??
            previousEntity.id_materia;

        if (entity.id_alumno != null) {
            await this.validarAlumnoExiste(
                entity.id_alumno
            );
        }

        if (entity.id_materia != null) {
            await this.validarMateriaExiste(
                entity.id_materia
            );
        }

        if (entity.nota != null) {
            validarNota(
                entity.nota
            );
        }

        if (entity.fecha != null) {
            validarFechaCalificacion(
                entity.fecha
            );
        }

        await this.validarCalificacionNoExiste(
            idAlumno,
            idMateria,
            entity.id
        );

        const rowsAffected =
            await this.CalificacionesRepository.updateAsync(entity);

        return rowsAffected;
    }

    deleteByIdAsync = async (id) => {
        console.log(
            `CalificacionesService.deleteByIdAsync(${id})`
        );

        const rowsAffected =
            await this.CalificacionesRepository.deleteByIdAsync(id);

        return rowsAffected;
    }

    validarAlumnoExiste = async (idAlumno) => {

        const alumno =
            await this.AlumnosService.getByIdAsync(idAlumno);

        validarEntidadExiste(
            alumno,
            `El alumno con id ${idAlumno} no existe.`
        );
    }

    validarMateriaExiste = async (idMateria) => {

        const materia =
            await this.MateriasService.getByIdAsync(idMateria);

        validarEntidadExiste(
            materia,
            `La materia con id ${idMateria} no existe.`
        );
    }

    validarCalificacionNoExiste = async (
        idAlumno,
        idMateria,
        id = null
    ) => {

        const calificaciones =
            await this.CalificacionesRepository.getAllAsync();

        const calificacionExistente =
            calificaciones.find(
                calificacion =>
                    calificacion.id_alumno === idAlumno &&
                    calificacion.id_materia === idMateria &&
                    calificacion.id !== id
            );

        validarSinConflicto(
            calificacionExistente,
            `Ya existe una calificación para ese alumno en esa materia.`
        );
    }

}