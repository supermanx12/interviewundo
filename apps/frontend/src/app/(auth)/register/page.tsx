import type { Metadata } from 'next';
import RegisterForm from './RegisterForm';

export const metadata: Metadata = {
  title: 'Sign Up & Practice — CodePrep',
  description:
    'Join CodePrep to solve real-world JavaScript, React, and Node.js challenges, master key interview concepts, and burn coding streaks.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
