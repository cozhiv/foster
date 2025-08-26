import { useRouter } from 'next/router';
import { useState } from 'react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch('/api/sendmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    setDone(true);
  };

  return done ? (
    <p>Thanks for the email!</p>
  ) : (
    <form onSubmit={handleSubmit}>
      <textarea

        placeholder="New Password"
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
}
