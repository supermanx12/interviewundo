import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  // Track password strength criteria
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const score = Object.values(criteria).filter(Boolean).length;

  const getStrengthText = () => {
    if (score <= 1) return 'Weak';
    if (score <= 3) return 'Medium';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (score <= 1) return 'bg-rose-500';
    if (score <= 3) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-2.5 pt-1">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-muted-foreground/80">Password Strength:</span>
        <span
          className={
            score === 4 ? 'text-emerald-500' : score >= 2 ? 'text-amber-500' : 'text-rose-500'
          }
        >
          {getStrengthText()}
        </span>
      </div>

      {/* Animated Progress Bar */}
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden flex gap-0.5">
        {[1, 2, 3, 4].map((barIdx) => (
          <div
            key={barIdx}
            className={`flex-1 h-full rounded-full transition-all duration-300 ${
              score >= barIdx ? getStrengthColor() : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Requirement Checklist */}
      <ul className="text-[10px] grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
        <li className="flex items-center gap-1.5 font-semibold text-muted-foreground">
          {criteria.length ? (
            <Check size={11} className="text-emerald-500 shrink-0" />
          ) : (
            <X size={11} className="text-muted-foreground/60 shrink-0" />
          )}
          <span className={criteria.length ? 'text-emerald-500/90' : ''}>8+ Characters</span>
        </li>
        <li className="flex items-center gap-1.5 font-semibold text-muted-foreground">
          {criteria.uppercase ? (
            <Check size={11} className="text-emerald-500 shrink-0" />
          ) : (
            <X size={11} className="text-muted-foreground/60 shrink-0" />
          )}
          <span className={criteria.uppercase ? 'text-emerald-500/90' : ''}>Uppercase Letter</span>
        </li>
        <li className="flex items-center gap-1.5 font-semibold text-muted-foreground">
          {criteria.lowercase ? (
            <Check size={11} className="text-emerald-500 shrink-0" />
          ) : (
            <X size={11} className="text-muted-foreground/60 shrink-0" />
          )}
          <span className={criteria.lowercase ? 'text-emerald-500/90' : ''}>Lowercase Letter</span>
        </li>
        <li className="flex items-center gap-1.5 font-semibold text-muted-foreground">
          {criteria.number ? (
            <Check size={11} className="text-emerald-500 shrink-0" />
          ) : (
            <X size={11} className="text-muted-foreground/60 shrink-0" />
          )}
          <span className={criteria.number ? 'text-emerald-500/90' : ''}>At least one number</span>
        </li>
      </ul>
    </div>
  );
}
