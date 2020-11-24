import { User } from '../models/user.models';
import jwt from 'jsonwebtoken';

const handleErrors = (err) => {
   console.log(err.message, err.code);
   let errors = { email: '', password: '' };

   // incorrect email
   if (err.message === 'incorrect email') {
      errors.email = 'that email is not registered';
   }

   // incorrect password
   if (err.message === 'incorrect password') {
      errors.password = 'that password is incorrect';
   }

   // duplicate email error
   if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
   }

   // validation errors
   if (err.message.includes('user validation failed')) {
      Object.values(err.errors).forEach(({ properties }) => {
         errors[properties.path] = properties.message;
      });
   }

   return errors;
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
   return jwt.sign({ id }, 'sty secret', {
      expiresIn: maxAge,
   });
};

export const getSignup = (req, res) => {
   res.render('signup');
};

export const getLogin = (req, res) => {
   res.render('login');
};

export const postSignup = async (req, res) => {
   const { email, password } = req.body;

   try {
      const user = await User.create({ email, password });
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user: user._id });
   } catch (err) {
      const errors = handleErrors(err);
      res.status(400).send({ errors });
   }
};

export const postLogin = async (req, res) => {
   const { email, password } = req.body;
   try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });
   } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
   }
};

export const getLogout = (req, res) => {
   res.cookie('jwt', '', { maxAge: 1 });
   res.redirect('/');
};
