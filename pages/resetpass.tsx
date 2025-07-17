import { useRouter } from 'next/router';
import { useState } from 'react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch('/api/auth/resetpass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    setDone(true);
  };

  if (!token) return <p>Missing token</p>;
  return done ? (
    <p>Password updated. You can now log in.</p>
  ) : (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
}
