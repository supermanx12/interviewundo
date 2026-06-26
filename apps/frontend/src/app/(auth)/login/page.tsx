import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign In — interviewUndo',
  description:
    'Sign in to your interviewUndo account to continue practicing coding challenges and technical interviews.',
};

export default function LoginPage() {
  return <LoginForm />;
}
