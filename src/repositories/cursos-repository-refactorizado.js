import BaseRepository from './base-repository.js';

export default class CalificacionesRepository extends BaseRepository {

    constructor() {
        console.log('Estoy en: CalificacionesRepository-new.constructor()');

        super('calificaciones');
    }

    createAsync = async (entity) => {
        console.log(`CalificacionesRepository-new.createAsync(${JSON.stringify(entity)})`);

        const sql = `INSERT INTO calificaciones (
                        id_alumno,
                        id_materia,
                        nota,
                        fecha
                    ) VALUES (
                        $1,
                        $2,
                        $3,
                        $4
                    ) RETURNING id`;

        const values = [
            entity?.id_alumno  ?? 0,
            entity?.id_materia ?? 0,
            entity?.nota       ?? 0,
            entity?.fecha      ?? null
        ];

        return await this.db.queryReturnId(sql, values);
    }

    updateAsync = async (entity) => {
        console.log(`CalificacionesRepository-new.updateAsync(${JSON.stringify(entity)})`);

        let id = entity.id;

        const previousEntity = await this.getByIdAsync(id);

        if (previousEntity == null) return 0;

        const sql = `UPDATE calificaciones SET
                        id_alumno  = $2,
                        id_materia = $3,
                        nota       = $4,
                        fecha      = $5
                    WHERE id = $1`;

        const values = [
            id,
            entity?.id_alumno  ?? previousEntity?.id_alumno,
            entity?.id_materia ?? previousEntity?.id_materia,
            entity?.nota       ?? previousEntity?.nota,
            entity?.fecha      ?? previousEntity?.fecha
        ];

        return await this.db.queryRowCount(sql, values);
    }

}