import Joi, { ObjectSchema } from "joi"

export const loginSchema: ObjectSchema = Joi.object({
  token: Joi.string().required(),
})
