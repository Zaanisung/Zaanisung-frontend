import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { validateEmail, validatePassword, validateGhanaPhone } from '../../utils/validation';
import { Lock, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AuthPages: React.FC = () => {
  const { currentRoute, navigateTo, loginAsCustomer, addToast } = useApp();

  // Screen state can be controlled by currentRoute: 'login' | 'register' | 'forgot-password' | 'verify-otp' | 'reset-password'
  const mode = currentRoute;

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Status
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!validateEmail(email)) errs.email = 'Please provide a valid email address';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginAsCustomer();
    }, 600);
  };

  // Register submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!validateEmail(email)) errs.email = 'Valid email is required';
    if (!validateGhanaPhone(phone)) errs.phone = 'Valid Ghana mobile phone number required';
    const pwdVal = validatePassword(password);
    if (!pwdVal.isValid) errs.password = pwdVal.errors[0];
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast({
        type: 'success',
        title: 'Registration Successful',
        message: 'Your ZAANISUNG client profile has been registered.',
      });
      loginAsCustomer();
    }, 800);
  };

  // Forgot password OTP request
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setErrors({ email: 'Valid email address required' });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast({
        type: 'info',
        title: 'Verification Code Dispatched',
        message: 'A 6-digit OTP code was generated for your account.',
      });
      navigateTo('verify-otp', { email });
    }, 600);
  };

  // OTP Verification
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setErrors({ otp: 'Please enter the 6-digit verification code' });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigateTo('reset-password', { email });
    }, 600);
  };

  // Reset Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const pwdVal = validatePassword(password);
    if (!pwdVal.isValid) {
      setErrors({ password: pwdVal.errors[0] });
      return;
    }
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast({
        type: 'success',
        title: 'Password Updated',
        message: 'Your account credentials have been reset. Please sign in.',
      });
      navigateTo('login');
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 text-left">
      <div className="bg-[#FFFFFF] border border-[#E4DED3] p-8 sm:p-10 rounded-xs shadow-xs">
        {/* Brand Kicker */}
        <div className="text-center mb-8">
          <span className="font-serif text-2xl tracking-[0.25em] text-[#171512] font-semibold block mb-2">
            ZAANISUNG
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#92733C]">
            Client Concierge Portal
          </span>
        </div>

        {/* 1. LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#171512] mb-1">
              Sign In to Your Account
            </h2>
            <p className="text-xs text-[#716C64] mb-4">
              Access order history, saved addresses, and private boutique allocations.
            </p>

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="kwame.mensah@example.com"
              required
            />

            <Input
              label="Account Password"
              isPassword
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="••••••••••••"
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => navigateTo('forgot-password')}
                className="text-[#92733C] hover:text-[#171512] transition-colors cursor-pointer"
              >
                Forgot your password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              isLoading={isLoading}
              className="mt-2"
            >
              Sign In
            </Button>

            <div className="pt-6 border-t border-[#E4DED3] text-center text-xs text-[#716C64]">
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                onClick={() => navigateTo('register')}
                className="text-[#92733C] font-semibold hover:text-[#171512] cursor-pointer"
              >
                Create Client Profile
              </button>
            </div>
          </form>
        )}

        {/* 2. REGISTRATION */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#171512] mb-1">
              Register Client Profile
            </h2>
            <p className="text-xs text-[#716C64] mb-4">
              Join the ZAANISUNG clientele for priority allocations and order tracking.
            </p>

            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
              placeholder="Nana Kwame Mensah"
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="kwame@example.com"
              required
            />

            <Input
              label="Ghana Mobile Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
              placeholder="0244 123 456"
              required
            />

            <Input
              label="Password"
              isPassword
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              helperText="Min. 8 characters with 1 capital and 1 number"
              required
            />

            <Input
              label="Confirm Password"
              isPassword
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              variant="gold"
              size="md"
              fullWidth
              isLoading={isLoading}
              className="mt-4"
            >
              Create Account
            </Button>

            <div className="pt-6 border-t border-[#E4DED3] text-center text-xs text-[#716C64]">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => navigateTo('login')}
                className="text-[#92733C] font-semibold hover:text-[#171512] cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* 3. FORGOT PASSWORD (OTP REQUEST) */}
        {mode === 'forgot-password' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#171512] mb-1">
              Password Recovery
            </h2>
            <p className="text-xs text-[#716C64] mb-4">
              Enter your registered email address. We will transmit a secure 6-digit verification code.
            </p>

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="kwame.mensah@example.com"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              isLoading={isLoading}
            >
              Send Verification Code
            </Button>

            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => navigateTo('login')}
                className="text-xs text-[#716C64] hover:text-[#171512] cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* 4. VERIFY OTP */}
        {mode === 'verify-otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#171512] mb-1">
              Enter Verification Code
            </h2>
            <p className="text-xs text-[#716C64] mb-4">
              A 6-digit OTP code was dispatched. Enter it below to confirm identity.
            </p>

            <Input
              label="6-Digit Verification Code"
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
              error={errors.otp}
              placeholder="e.g. 748291"
              className="text-center font-mono tracking-widest text-lg"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              isLoading={isLoading}
            >
              Verify Code
            </Button>

            <div className="pt-4 text-center text-xs text-[#716C64]">
              Didn&apos;t receive code?{' '}
              <button
                type="button"
                onClick={() => setOtpCode('824190')}
                className="text-[#92733C] font-semibold cursor-pointer"
              >
                Use Demo OTP (824190)
              </button>
            </div>
          </form>
        )}

        {/* 5. RESET PASSWORD */}
        {mode === 'reset-password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#171512] mb-1">
              Choose New Password
            </h2>
            <p className="text-xs text-[#716C64] mb-4">
              Create a new secure password for your client profile.
            </p>

            <Input
              label="New Password"
              isPassword
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              helperText="Min. 8 characters with uppercase and number"
              required
            />

            <Input
              label="Confirm New Password"
              isPassword
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              variant="gold"
              size="md"
              fullWidth
              isLoading={isLoading}
            >
              Save New Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
