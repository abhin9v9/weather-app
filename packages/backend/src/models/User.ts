import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserPreferences } from '../types';

// Mongoose document interface
export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Mongoose model interface
interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
}

const userPreferencesSchema = new Schema<UserPreferences>(
  {
    temperatureUnit: {
      type: String,
      enum: ['celsius', 'fahrenheit'],
      default: 'celsius',
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
  },
  { _id: false }
);

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Don't include password in queries by default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    preferences: {
      type: userPreferencesSchema,
      default: () => ({
        temperatureUnit: 'celsius',
        theme: 'light',
      }),
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete (ret as any)._id;
        delete (ret as any).__v;
        delete (ret as any).password;
        return ret;
      },
    },
  }
);

// Index for faster email lookups
userSchema.index({ email: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return;
  }

  // Generate salt and hash password
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch {
    return false;
  }
};

// Static method to find user by email
userSchema.statics.findByEmail = function (
  email: string
): Promise<IUserDocument | null> {
  return this.findOne({ email: email.toLowerCase() }).select('+password');
};

export const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export default User;
