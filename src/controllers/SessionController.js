const database = require('../database/connection');

module.exports = {
    /**
     * Cria uma sessão (login)
     */
    async create(request, response) {
        const { id } = request.body;
        const ong = await database('ongs')
            .select('name')
            .where('id', id)
            .first();

        if ( ! ong) {
            return response.status(400).json({
                error: 'No ONG found with this ID'
            });
        }

        return response.json(ong);
    }


}