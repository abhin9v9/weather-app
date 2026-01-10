import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { Layout, Button, Input } from '../components';
import { useAuth } from '../hooks';
import { isValidEmail, isValidPassword, isValidName, getPasswordStrength } from '../utils';
import { ROUTES } from '../utils';

const Register: React.FC = () => {
  const { register, isRegistering } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const passwordStrength = getPasswordStrength(password);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!isValidName(name)) {
      newErrors.name = 'Name must be between 2 and 50 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(password)) {
      newErrors.password =
        'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await register({
      name: name.trim(),
      email: email.trim(),
      password,
    });
  };

  const strengthColors = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500',
  };

  const strengthWidth = {
    weak: 'w-1/3',
    medium: 'w-2/3',
    strong: 'w-full',
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
            <p className="mt-2 text-gray-600">
              Join us and start tracking weather in your favorite cities
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                error={errors.name}
                leftIcon={<FiUser className="h-5 w-5" />}
                autoComplete="name"
              />

              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                error={errors.email}
                leftIcon={<FiMail className="h-5 w-5" />}
                autoComplete="email"
              />

              <div>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  error={errors.password}
                  leftIcon={<FiLock className="h-5 w-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  }
                  autoComplete="new-password"
                />
                {password && (
                  <div className="mt-2">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strengthColors[passwordStrength]} ${strengthWidth[passwordStrength]}`}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 capitalize">
                      Password strength: {passwordStrength}
                    </p>
                  </div>
                )}
              </div>

              <Input
                label="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                error={errors.confirmPassword}
                leftIcon={<FiLock className="h-5 w-5" />}
                rightIcon={
                  confirmPassword && password === confirmPassword ? (
                    <FiCheck className="h-5 w-5 text-green-500" />
                  ) : undefined
                }
                autoComplete="new-password"
              />

              <div className="text-sm text-gray-600">
                <p className="mb-2">Password requirements:</p>
                <ul className="space-y-1">
                  {[
                    { check: password.length >= 8, text: 'At least 8 characters' },
                    { check: /[A-Z]/.test(password), text: 'One uppercase letter' },
                    { check: /[a-z]/.test(password), text: 'One lowercase letter' },
                    { check: /\d/.test(password), text: 'One number' },
                  ].map((req, index) => (
                    <li
                      key={index}
                      className={`flex items-center space-x-2 ${
                        req.check ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      <FiCheck className="h-4 w-4" />
                      <span>{req.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                type="submit"
                fullWidth
                isLoading={isRegistering}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to={ROUTES.LOGIN}
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
