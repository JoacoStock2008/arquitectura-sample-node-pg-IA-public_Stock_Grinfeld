import Db from './db-pg.js';

export default class CalificacionesRepository {

    constructor() {
        console.log('Estoy en: CalificacionesRepository-new.constructor()');
        this.db = new Db();
    }

    getAllAsync = async () => {
        console.log(`CalificacionesRepository-new.getAllAsync()`);
        const sql = `SELECT * FROM calificaciones`;
        return await this.db.queryAll(sql);
    }

    getByIdAsync = async (id) => {
        console.log(`CalificacionesRepository-new.getByIdAsync(${id})`);
        const sql = `SELECT * FROM calificaciones WHERE id=$1`;
        return await this.db.queryOne(sql, [id]);
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

    deleteByIdAsync = async (id) => {
        console.log(`CalificacionesRepository-new.deleteByIdAsync(${id})`);
        const sql = `DELETE FROM calificaciones WHERE id=$1`;
        return await this.db.queryRowCount(sql, [id]);
    }

}