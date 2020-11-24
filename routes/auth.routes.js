import { Router } from 'express';
import {
   getLogin,
   getSignup,
   postLogin,
   postSignup,
   getLogout,
} from '../controller/auth.controller';

const router = Router();

router.get('/signup', getSignup);
router.post('/signup', postSignup);
router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/logout', getLogout);

export default router;
