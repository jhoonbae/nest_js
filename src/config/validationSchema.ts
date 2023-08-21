import * as joi from 'joi';

export const validationSchema = joi.object({
    EMAIL_SERVICE : joi.string().required(),
    EMAIL_HOST : joi.string().required(),
    EMAIL_PASS : joi.string().required(),
    BASE_URL : joi.string().required().uri()
})