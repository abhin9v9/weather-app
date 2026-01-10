import { User, IUserDocument } from '../models/User';
import { ApiError } from '../middlewares';
import { generateTokens, verifyRefreshToken } from '../utils';
import {
  CreateUserDTO,
  LoginDTO,
  AuthTokens,
  UserResponse,
  TokenPayload,
} from '../types';

/**
 * Auth Service
 * Handles user authentication operations
 */
class AuthService {
  /**
   * Register a new user
   */
  async register(userData: CreateUserDTO): Promise<{ user: UserResponse; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(409, 'A user with this email already exists');
    }

    // Create new user
    const user = await User.create({
      email: userData.email.toLowerCase(),
      password: userData.password,
      name: userData.name,
    });

    // Generate tokens
    const tokenPayload: Omit<TokenPayload, 'iat' | 'exp'> = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
    const tokens = generateTokens(tokenPayload);

    // Transform user response
    const userResponse = this.transformUserResponse(user);

    return { user: userResponse, tokens };
  }

  /**
   * Login user
   */
  async login(credentials: LoginDTO): Promise<{ user: UserResponse; tokens: AuthTokens }> {
    // Find user by email (include password field)
    const user = await User.findByEmail(credentials.email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(credentials.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate tokens
    const tokenPayload: Omit<TokenPayload, 'iat' | 'exp'> = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
    const tokens = generateTokens(tokenPayload);

    // Transform user response
    const userResponse = this.transformUserResponse(user);

    return { user: userResponse, tokens };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Check if user still exists
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new ApiError(401, 'User no longer exists');
      }

      // Generate new tokens
      const tokenPayload: Omit<TokenPayload, 'iat' | 'exp'> = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      };

      return generateTokens(tokenPayload);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(401, 'Invalid or expired refresh token');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserResponse> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return this.transformUserResponse(user);
  }

  /**
   * Update user preferences
   */
  async updatePreferences(
    userId: string,
    preferences: Partial<{ temperatureUnit: 'celsius' | 'fahrenheit'; theme: 'light' | 'dark' }>
  ): Promise<UserResponse> {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'preferences.temperatureUnit': preferences.temperatureUnit,
          'preferences.theme': preferences.theme,
        },
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return this.transformUserResponse(user);
  }

  /**
   * Transform user document to response format
   */
  private transformUserResponse(user: IUserDocument): UserResponse {
    return {
      id: (user as any)._id.toString(),
      email: user.email,
      name: user.name,
      preferences: user.preferences,
      createdAt: user.createdAt,
    };
  }
}

// Export singleton instance
export const authService = new AuthService();
