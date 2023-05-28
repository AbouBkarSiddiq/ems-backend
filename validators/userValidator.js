import Joi from "joi";

const registerValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  isAdmin: Joi.boolean().required(),
  imageUrl: Joi.string().required()

});

export default registerValidationSchema;

