const database = require('../database/connection');

module.exports = {
    /**
     * Lista todos os casos de uma ONG
     */
    async index(request, response) {
        const ong_id = request.headers.authorization;
        const incidents = await database('incidents')
            .select('*')
            .where('ong_id', ong_id);
        
        return response.json(incidents);
    },
}