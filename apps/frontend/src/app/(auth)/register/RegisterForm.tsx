'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, type RegisterDTO } from '@interviewprep/shared-types';
import { useAuth, useToast } from '@/providers';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Loader2, AlertCircle, Terminal } from 'lucide-react';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { OAuthButtons } from './OAuthButtons';

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterDTO>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const password = watch('password', '');

  const onSubmit = async (data: RegisterDTO) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await registerUser(data);
      showSuccess('Account created successfully! Welcome to CodePrep.');
      router.push('/dashboard');
    } catch (err: any) {
      const errMsg = err.message || 'Registration failed. Email might already be in use.';
      setServerError(errMsg);
      showError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border bg-card/60 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden relative">
      <CardHeader className="pt-8 pb-6 px-8 text-center flex flex-col items-center">
        {/* Brand Logo */}
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/10 mb-4">
          <Terminal size={22} />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1.5">
          Join CodePrep to practice challenges and master tech interviews
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        {serverError && (
          <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3 text-xs leading-normal">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div className="font-semibold">{serverError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground/80" htmlFor="name">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className={`rounded-xl h-11 border-border bg-background/50 focus:border-ring ${
                errors.name ? 'border-destructive focus:ring-destructive/25' : ''
              }`}
              {...register('name')}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-[11px] font-semibold text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground/80" htmlFor="email">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className={`rounded-xl h-11 border-border bg-background/50 focus:border-ring ${
                errors.email ? 'border-destructive focus:ring-destructive/25' : ''
              }`}
              {...register('email')}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-[11px] font-semibold text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground/80" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`rounded-xl h-11 pr-11 border-border bg-background/50 focus:border-ring ${
                  errors.password ? 'border-destructive focus:ring-destructive/25' : ''
                }`}
                {...register('password')}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground/60 hover:text-foreground transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] font-semibold text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Password Strength Meter */}
          <PasswordStrengthMeter password={password} />

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-50 hover:to-violet-500 font-semibold text-white shadow-md shadow-indigo-500/10 transition-all active:scale-[0.98] mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center">
          <div className="flex-grow border-t border-border/60"></div>
          <span className="mx-4 flex-shrink text-xs text-muted-foreground/60 font-semibold uppercase tracking-wider">
            Or continue with
          </span>
          <div className="flex-grow border-t border-border/60"></div>
        </div>

        {/* OAuth Buttons */}
        <OAuthButtons disabled={isSubmitting} />

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
