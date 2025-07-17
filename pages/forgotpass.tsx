// A simple email form
import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch('/api/auth/forgotpass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setSent(true);
  };

  return sent ? (
    <p>Check your email for a password reset link.</p>
  ) : (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <button type="submit">Send Reset Link</button>
    </form>
  );
}
