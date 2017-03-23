import * as crypto from 'crypto'
import { TinyPg } from 'tinypg'
import bcrypt from 'bcrypt-nodejs'
const mongoose = require('mongoose');

export interface User {
  user_id: number
  email: string
  password: string
  passwordResetToken?: string
  passwordResetExpires?: Date

  facebook: string
  twitter: string
  google: string
  github: string
  instagram: string
  linkedin: string
  steam: string
  tokens: any[]

  profile: {
    name: string
    gender: string
    location: string
    website: string
    picture: string
  }
}

export interface UserCreate {
  email: string
  password: string
}

export class UserService {
  db: TinyPg

  constructor (db: TinyPg) {
    this.db = db
  }

  save(create: UserCreate): Promise<User> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) { reject(err) }
        
        return bcrypt.hash(create.password, salt, null, (err, hash) => {
          if (err) { reject(err) }
          
          return this.db.sql<User>('user.save', {
            email: create.email,
            password_hash: hash,
          })
          .then(res => {
            resolve(res.rows[0])
          })
          .catch(e => {
            reject(e)
          })
        })
      })
    })
  }

  comparePasswords(user: User, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          reject(err)
        }
          
        resolve(isMatch)
      })
    })
  }

  gravatarUrl(user: User, size: number = 200): string {
    if (!size) {
      size = 200;
    }

    if (user.email.trim() === '') {
      return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }

    const md5 = crypto.createHash('md5').update(user.email).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
  }
}

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  facebook: String,
  twitter: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  steam: String,
  tokens: Array,

  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String
  }
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

export default mongoose.model('User', userSchema);

