import { Schema, model } from 'mongoose';
import { isEmail } from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
   email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email'],
   },
   password: {
      type: String,
      required: [true, 'Please enter an password'],
      minlength: [6, 'Minimum password length is 6 characters'],
   },
});

// Save Hooks
userSchema.post('save', (doc, next) => {
   console.log('new user was created & saved', doc);
   next();
});

// Prev Save Hooks
userSchema.pre('save', async function (next) {
   const salt = await bcrypt.genSalt();
   return (this.password = await bcrypt.hash(this.password, salt));
   next();
});

userSchema.statics.login = async function (email, password) {
   const user = await this.findOne({ email });
   if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
         return user;
      }
      throw Error('incorrect password');
   }

   throw Error('incorrect email');
};

export const User = model('user', userSchema);
