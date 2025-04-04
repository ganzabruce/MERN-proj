const Joi = require('joi');

const signUpSchema = Joi.object()
    .keys({
        firstName: Joi.string()
            .min(3)
            .max(40)
            .required(),
        lastname : Joi.string()
            .min(3)
            .max(50)
            .required(),
        email: Joi.string()
            .min(3)
            .max(50)
            .required(),
        password: Joi.string()
            .min(3)
            .max(12)
            .required()
    })

module.exports = {
    signUpSchema
}