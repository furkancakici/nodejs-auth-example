import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' });

// database connection
const dbURI = process.env.MONGO_URI;

const connectDB = async () => {
   try {
      const conn = await mongoose.connect(dbURI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         useCreateIndex: true,
      });
   } catch (error) {
      console.error(error);
      process.exit(1);
   }
};

export default connectDB;
