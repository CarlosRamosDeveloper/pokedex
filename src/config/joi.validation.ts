import * as Joi from "joi"

export const JoiValidationSchema = Joi.object({
    MONGODB: Joi.required(),
    PORT: Joi.number().default(999),
    DEFAULT_LIMIT: Joi.number().default(2),
    DEFAULT_OFFSET: Joi.number().default(0),
});