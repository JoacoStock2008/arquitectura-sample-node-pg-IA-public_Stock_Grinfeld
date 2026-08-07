import CalificacionesRepository from '../repositories/calificaciones-repository.js';
import AlumnosService from './alumnos-service.js';
import MateriasService from './materias-service.js';

export default class CalificacionesService {

    constructor() {
        console.log('Estoy en: CalificacionesService.constructor()');

        this.CalificacionesRepository = new CalificacionesRepository();
        this.AlumnosService           = new AlumnosService();
        this.MateriasService          = new MateriasService();
    }

    getAllAsync = async () => {
        console.log(`CalificacionesService.getAllAsync()`);

        const returnArray = await this.CalificacionesRepository.getAllAsync();
        return returnArray;
    }

    getByIdAsync = async (id) => {
        console.log(`CalificacionesService.getByIdAsync(${id})`);

        const returnEntity = await this.CalificacionesRepository.getByIdAsync(id);
        return returnEntity;
    }

    createAsync = async (entity) => {
        console.log(`CalificacionesService.createAsync(${JSON.stringify(entity)})`);

        // Reglas de negocio.
        await this.validarAlumnoExiste(entity.id_alumno);
        await this.validarMateriaExiste(entity.id_materia);

        this.validarNota(entity.nota);
        this.validarFecha(entity.fecha);

        await this.validarCalificacionNoExiste(
            entity.id_alumno,
            entity.id_materia
        );

        const rowsAffected = await this.CalificacionesRepository.createAsync(entity);
        return rowsAffected;
    }

    updateAsync = async (entity) => {
        console.log(`CalificacionesService.updateAsync(${JSON.stringify(entity)})`);

        const previousEntity = await this.CalificacionesRepository.getByIdAsync(entity.id);

        if (previousEntity == null) {
            return 0;
        }

        const idAlumno = entity?.id_alumno ?? previousEntity.id_alumno;
        const idMateria = entity?.id_materia ?? previousEntity.id_materia;

        if (entity.id_alumno) {
            await this.validarAlumnoExiste(entity.id_alumno);
        }

        if (entity.id_materia) {
            await this.validarMateriaExiste(entity.id_materia);
        }

        if (entity.nota != null) {
            this.validarNota(entity.nota);
        }

        if (entity.fecha != null) {
            this.validarFecha(entity.fecha);
        }

        await this.validarCalificacionNoExiste(
            idAlumno,
            idMateria,
            entity.id
        );

        const rowsAffected = await this.CalificacionesRepository.updateAsync(entity);
        return rowsAffected;
    }

    deleteByIdAsync = async (id) => {
        console.log(`CalificacionesService.deleteByIdAsync(${id})`);

        const rowsAffected = await this.CalificacionesRepository.deleteByIdAsync(id);
        return rowsAffected;
    }

    validarAlumnoExiste = async (idAlumno) => {

        const alumno = await this.AlumnosService.getByIdAsync(idAlumno);

        if (alumno == null) {
            throw new Error(`El alumno con id ${idAlumno} no existe.`);
        }
    }

    validarMateriaExiste = async (idMateria) => {

        const materia = await this.MateriasService.getByIdAsync(idMateria);

        if (materia == null) {
            throw new Error(`La materia con id ${idMateria} no existe.`);
        }
    }

    validarNota = (nota) => {

        if (nota == null || nota < 1 || nota > 10) {
            throw new Error(`La nota debe ser un valor entre 1 y 10.`);
        }
    }

    validarFecha = (fecha) => {

        const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;

        if (!formatoFecha.test(fecha)) {
            throw new Error(`La fecha debe tener el formato YYYY-MM-DD.`);
        }

        const [anio, mes, dia] = fecha.split('-').map(Number);

        const fechaCalificacion = new Date(anio, mes - 1, dia);
        const fechaActual = new Date();

        const fechaValida =
            fechaCalificacion.getFullYear() === anio &&
            fechaCalificacion.getMonth() === mes - 1 &&
            fechaCalificacion.getDate() === dia;

        if (!fechaValida) {
            throw new Error(`La fecha ingresada no es válida.`);
        }

        if (anio !== fechaActual.getFullYear()) {
            throw new Error(`La fecha debe pertenecer al año actual.`);
        }

        fechaActual.setHours(0, 0, 0, 0);

        if (fechaCalificacion > fechaActual) {
            throw new Error(`La fecha no puede ser mayor a la fecha actual.`);
        }
    }

    validarCalificacionNoExiste = async (idAlumno, idMateria, id = null) => {

        const calificaciones = await this.CalificacionesRepository.getAllAsync();

        const calificacionExistente = calificaciones.find(calificacion =>
            calificacion.id_alumno === idAlumno &&
            calificacion.id_materia === idMateria &&
            calificacion.id !== id
        );

        if (calificacionExistente != null) {
            throw new Error(
                `Ya existe una calificación para el alumno ${idAlumno} en la materia ${idMateria}.`
            );
        }
    }

}