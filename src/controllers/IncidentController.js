const database = require('../database/connection');

module.exports = {
    /**
     * Retorna todas as ONGs cadastradas
     */
    async index(request, response) {
        const { page = 1, ong_id = null} = request.query;
        const page_limit = 5;
        const fields = [
            'incidents.*',
            'ongs.name',
            'ongs.email',
            'ongs.whatsapp',
            'ongs.city',
            'ongs.uf',
        ];

        let incidents  = [];
        let count      = 0;

        if (ong_id) {
            incidents = await database('incidents')
                .select(fields)
                .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
                .limit(page_limit)
                .offset((page - 1) * page_limit)
                .where('ong_id', ong_id);

                [count] = await database('incidents')
                    .count()
                    .where('ong_id', ong_id);
        } else {
            incidents = await database('incidents')
                .select(fields)
                .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
                .limit(page_limit)
                .offset((page - 1) * page_limit);

            [count] = await database('incidents').count();
        }

        
        response.header('X-Total-Count', count['count(*)']);

        return response.json(incidents);
    },

    /**
     * Registra um novo caso (incident)
     */
    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await database('incidents').insert({
            title,
            description,
            value,
            ong_id
        });

        return response.json({ id });
    },

    /**
     * Deleta um Caso (incident) pelo 'id' informado
     */
    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await database('incidents')
            .select('ong_id')
            .where('id', id)
            .first();

        if (incident.ong_id !== ong_id) {
            return response.status(401).json({
                error: 'Operation not permitted.'
            });
        }

        await database('incidents')
            .delete()
            .where('id', id);
        
        return response.status(204).send();
    },
}