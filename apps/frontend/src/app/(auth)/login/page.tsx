import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign In — CodePrep',
  description:
    'Sign in to your CodePrep account to continue practicing coding challenges and technical interviews.',
};

export default function LoginPage() {
  return <LoginForm />;
}
