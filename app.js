import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';
import { checkUser, requireAuth } from './middleware/authMiddleware';

dotenv.config({ path: './config/config.env' });

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// db
connectDB();

// view engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', './views');
app.set('layout', 'layouts/layout');

// port
const PORT = process.env.PORT || 5000;

app.listen(
   PORT,
   console.log(
      `Server running in ${process.env.NODE_ENV} http://${process.env.HOST}:${process.env.PORT}`
   )
);

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);
