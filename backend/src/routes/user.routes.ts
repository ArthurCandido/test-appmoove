import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createUserSchema, updateUserSchema } from '../validators/user.validator.js';

const router = Router();

router.post('/', validateBody(createUserSchema), userController.create);
router.get('/', userController.index);
router.get('/:id', userController.show);
router.put('/:id', validateBody(updateUserSchema), userController.update);
router.delete('/:id', userController.remove);

export default router;
