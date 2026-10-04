"use client";

import React, { useEffect, useState, useContext, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowLeft, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import SvgLogo from '@/svg';
import { AppContext } from '@/context/AppContext';

const ResetPasswordForm = () => {
  const { showMessage, resetPasswordWithToken }: any = useContext(AppContext) || {};
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [accountEmail, setAccountEmail] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setTokenValid(false);
      setTokenError('No reset token was found in the link. Please request a new password reset from the login page.');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (res.ok && data.valid) {
          setTokenValid(true);
          setAccountEmail(data.email || '');
        } else {
          setTokenValid(false);
          setTokenError(data.error || 'This password reset link is invalid or has expired.');
        }
      } catch (err) {
        console.error('Error verifying token:', err);
        setTokenValid(false);
        setTokenError('Unable to verify reset token. Please check your internet connection.');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      showMessage?.('Missing reset token');
      return;
    }

    if (password.length < 6) {
      showMessage?.('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      showMessage?.('Passwords do not match');
      return;
    }

    setLoading(true);
    const { error, message } = await resetPasswordWithToken(token, password);
    setLoading(false);

    if (error) {
      showMessage?.(error.message);
      return;
    }

    setIsSuccess(true);
    showMessage?.(message || 'Password updated successfully!');
    setTimeout(() => {
      router.push('/login');
    }, 2500);
  };

  if (verifying) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-10 h-10 border-4 border-[#2f4739] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[#7a7268] dark:text-[#a49b8f]">Verifying your reset link...</p>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="bg-white dark:bg-[#1a241f] border border-[#e7e0d5] dark:border-[#2a3d33] rounded-2xl p-8 md:p-12 shadow-card space-y-6 text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-full flex items-center justify-center mx-auto text-red-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-medium text-[#1f1c18] dark:text-[#f4f0ea]">Invalid or Expired Link</h2>
          <p className="text-sm text-[#5e574d] dark:text-[#a49b8f] max-w-sm mx-auto">
            {tokenError}
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-[#2f4739] hover:bg-[#23372c] text-[#f7f1e6] font-semibold py-3 px-6 rounded-lg text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Login
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-white dark:bg-[#1a241f] border border-[#e7e0d5] dark:border-[#2a3d33] rounded-2xl p-8 md:p-12 shadow-card space-y-6 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 rounded-full flex items-center justify-center mx-auto text-green-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-medium text-[#1f1c18] dark:text-[#f4f0ea]">Password Reset Successfully!</h2>
          <p className="text-sm text-[#5e574d] dark:text-[#a49b8f]">
            Your password has been securely updated. Redirecting you to the login page...
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-[#2f4739] hover:bg-[#23372c] text-[#f7f1e6] font-semibold py-3 px-6 rounded-lg text-sm transition"
          >
            Go to Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1a241f] border border-[#e7e0d5] dark:border-[#2a3d33] rounded-2xl p-8 md:p-12 shadow-card space-y-8">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <SvgLogo className="w-14 h-14 bg-transparent" />
        </div>
        <span className="text-xs uppercase tracking-[0.14em] text-[#8d6b4f] dark:text-[#d4a373] font-bold">
          Account Security
        </span>
        <h1 className="text-3xl font-serif font-medium text-[#1f1c18] dark:text-[#f4f0ea]">
          Set New <span className="text-[#2f4739] dark:text-[#489a69]">Password</span>
        </h1>
        {accountEmail && (
          <p className="text-xs text-[#5e574d] dark:text-[#a49b8f]">
            Resetting password for: <span className="font-semibold text-[#1f1c18] dark:text-[#f4f0ea]">{accountEmail}</span>
          </p>
        )}
      </div>

      <form onSubmit={handleUpdatePassword} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1f1c18] dark:text-[#f4f0ea]">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d6b4f] dark:text-[#d4a373] w-4 h-4" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#f7f1e6] dark:bg-[#121815] border border-[#e7e0d5] dark:border-[#2a3d33] px-4 py-3.5 pl-11 pr-11 rounded-2xl focus:border-[#2f4739] focus:outline-none text-[#1f1c18] dark:text-[#f4f0ea] placeholder:text-[#a49b8f] transition text-sm font-medium"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a49b8f] hover:text-[#1f1c18] dark:hover:text-[#f4f0ea]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1f1c18] dark:text-[#f4f0ea]">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d6b4f] dark:text-[#d4a373] w-4 h-4" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-type new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#f7f1e6] dark:bg-[#121815] border border-[#e7e0d5] dark:border-[#2a3d33] px-4 py-3.5 pl-11 rounded-2xl focus:border-[#2f4739] focus:outline-none text-[#1f1c18] dark:text-[#f4f0ea] placeholder:text-[#a49b8f] transition text-sm font-medium"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2f4739] hover:bg-[#23372c] dark:bg-[#346244] dark:hover:bg-[#3e7552] text-[#f7f1e6] font-semibold py-4 rounded-lg transition shadow-soft text-base active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Updating Password...' : 'Save New Password'}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-[#e7e0d5] dark:border-[#2a3d33]">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-[#7a7268] dark:text-[#a49b8f] hover:text-[#1f1c18] dark:hover:text-[#f4f0ea] font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </Link>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => {
  return (
    <section className="py-16 px-4 max-w-lg mx-auto text-[#1f1c18] dark:text-[#f4f0ea]">
      <Suspense
        fallback={
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-[#2f4739] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#7a7268] mt-4">Loading reset page...</p>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </section>
  );
};

export default ResetPasswordPage;
