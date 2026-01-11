import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// Define a simplified type for Favorite
export interface IFavorite {
  _id?: string;
  userId: Types.ObjectId | string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  addedAt?: Date;
}

// Mongoose document interface
export interface IFavoriteDocument extends Document {
  userId: Types.ObjectId;
  city: string;
  country: string;
  lat: number;
  lon: number;
  addedAt: Date;
}

// Mongoose model interface
interface IFavoriteModel extends Model<IFavoriteDocument> {
  findByUser(userId: string): Promise<IFavoriteDocument[]>;
}

const favoriteSchema = new Schema<IFavoriteDocument, IFavoriteModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    city: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
      maxlength: [100, 'City name cannot exceed 100 characters'],
    },
    country: {
      type: String,
      required: [true, 'Country code is required'],
      trim: true,
      uppercase: true,
      minlength: [2, 'Country code must be at least 2 characters'],
      maxlength: [3, 'Country code cannot exceed 3 characters'],
    },
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    lon: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    toJSON: {
      transform: function (_doc, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete (ret as any)._id;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Compound index to prevent duplicate favorites for the same user
favoriteSchema.index({ userId: 1, city: 1, country: 1 }, { unique: true });

// Index for faster lookups by user
favoriteSchema.index({ userId: 1, addedAt: -1 });

// Static method to find favorites by user
favoriteSchema.statics.findByUser = function (
  userId: string
): Promise<IFavoriteDocument[]> {
  return this.find({ userId }).sort({ addedAt: -1 }).exec();
};

// Pre-save middleware to normalize city and country
favoriteSchema.pre('save', function () {
  // Capitalize first letter of each word in city name
  this.city = this.city
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
});

export const Favorite = mongoose.model<IFavoriteDocument, IFavoriteModel>(
  'Favorite',
  favoriteSchema
);

export default Favorite;
