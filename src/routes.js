const express                      = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const OngController      = require('./controllers/OngController');
const SessionController  = require('./controllers/SessionController');
const IncidentController = require('./controllers/IncidentController');
const ProfileController  = require('./controllers/ProfileController');

const routes     = express.Router();

routes.post('/sessions', SessionController.create);

// Cadastra uma nova ONG
routes.post('/ongs', celebrate({
    [ Segments.BODY ]: Joi.object().keys({
        name:     Joi.string().required(),
        email:    Joi.string().required().email(),
        whatsapp: Joi.string().required().min(10).max(11),
        city:     Joi.string().required(),
        uf:       Joi.string().required().length(2)
    })
}), OngController.create);

// Lista todas as ONGs cadastradas
routes.get('/ongs', OngController.index);

// Cadastra um novo caso (incident)
routes.post('/incidents', IncidentController.create);

// Lista todos os Casos cadastrados
routes.get('/incidents', celebrate({
    [ Segments.QUERY ]: Joi.object().keys({
        page:   Joi.number(),
        ong_id: Joi.string()
    })
}), IncidentController.index);

// Deleta um caso do banco de dados
routes.delete('/incidents/:id', celebrate({
    [ Segments.PARAMS ]: Joi.object().keys({
        id: Joi.number().required()
    })
}), IncidentController.delete);

// Lista todos os casos cadastrados por uma ong
routes.get('/profile', celebrate({
    [ Segments.HEADERS ]: Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}), ProfileController.index);

module.exports = routes;
