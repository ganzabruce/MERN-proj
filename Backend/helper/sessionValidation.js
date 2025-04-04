const Joi = require('joi');
const sessionSchema = Joi.object()
    .keys({
        mentorIdId: Joi.string()
            .min(3)
            .max(100)
            .required(),
        menteeId : Joi.string()
            .min(3)
            .max(100)
            .required(),
        questions: Joi.string()
            .min(3)
            .max(10000)
            .required(),
        menteeEmail: Joi.string()
            .min(3)
            .max(50)
            .required(),
        status: Joi.string()
            .min(3)
            .max(10)
            .required()
    })

module.exports = {
    sessionSchema
}