import jwt from 'jsonwebtoken';
import { User } from '../models/user.models';

export const requireAuth = (req, res, next) => {
   const token = req.cookies.jwt;

   if (token) {
      jwt.verify(token, 'sty secret', (err, decodedToken) => {
         if (err) {
            console.log(err.message);
            res.redirect('/login');
         } else {
            console.log(decodedToken);
            next();
         }
      });
   } else {
      res.redirect('/login');
   }
};

export const checkUser = (req, res, next) => {
   const token = req.cookies.jwt;

   if (token) {
      jwt.verify(token, 'sty secret', async (err, decodedToken) => {
         if (err) {
            res.locals.user = null;
            next();
         } else {
            console.log(decodedToken);
            let user = await User.findById(decodedToken.id);
            res.locals.user = user;
            next();
         }
      });
   } else {
      res.locals.user = null;
      next();
   }
};
