import AlumnosRepository from '../repositories/alumnos-repository.js';
import CursosService from './cursos-service.js';

import {
    agregarEdad,
    validarFechaNacimiento
} from '../helpers/fechas-helper.js';

import {
    validarEntidadExiste
} from '../helpers/validaciones-helper.js';

export default class AlumnosService {

    constructor() {
        console.log('Estoy en: AlumnosService.constructor()');

        this.AlumnosRepository = new AlumnosRepository();
        this.CursosService = new CursosService();
    }

    getAllAsync = async () => {
        console.log(`AlumnosService.getAllAsync()`);

        const returnArray =
            await this.AlumnosRepository.getAllAsync();

        if (returnArray == null) return null;

        return returnArray.map(
            alumno => agregarEdad(alumno)
        );
    }

    getByIdAsync = async (id) => {
        console.log(`AlumnosService.getByIdAsync(${id})`);

        const returnEntity =
            await this.AlumnosRepository.getByIdAsync(id);

        return agregarEdad(returnEntity);
    }

    createAsync = async (entity) => {
        console.log(
            `AlumnosService.createAsync(${JSON.stringify(entity)})`
        );

        await this.validarCursoExiste(entity.id_curso);

        validarFechaNacimiento(
            entity.fecha_nacimiento
        );

        const rowsAffected =
            await this.AlumnosRepository.createAsync(entity);

        return rowsAffected;
    }

    updateAsync = async (entity) => {
        console.log(
            `AlumnosService.updateAsync(${JSON.stringify(entity)})`
        );

        if (entity.id_curso != null) {
            await this.validarCursoExiste(
                entity.id_curso
            );
        }

        if (entity.fecha_nacimiento != null) {
            validarFechaNacimiento(
                entity.fecha_nacimiento
            );
        }

        const rowsAffected =
            await this.AlumnosRepository.updateAsync(entity);

        return rowsAffected;
    }

    deleteByIdAsync = async (id) => {
        console.log(
            `AlumnosService.deleteByIdAsync(${id})`
        );

        const rowsAffected =
            await this.AlumnosRepository.deleteByIdAsync(id);

        return rowsAffected;
    }

    validarCursoExiste = async (idCurso) => {

        const curso =
            await this.CursosService.getByIdAsync(idCurso);

        validarEntidadExiste(
            curso,
            `El curso con id ${idCurso} no existe.`
        );
    }

}