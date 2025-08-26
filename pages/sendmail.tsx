import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);
  const [subject, setSubject] = useState('')
  const [respondent, setRespondent] = useState('')

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch('/api/sendmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ respondent, subject, message }),
    });
    setDone(true);
  };

  return (
    <div className="">
      <Link key='LinkToBudget' href={'/'}>Home</Link>
      {done ? (

        <h2>Thanks for the email!</h2>
      ) : (

        <div className="">
          
          <h1>Send email to author</h1>
          <div className="send-email">
            <div className="container input-container">
              <input
                className="add-item-ctrl"
                type="text"
                value={respondent}
                onChange={(e) => setRespondent(e.target.value)}
                placeholder="Your Name"
              />
              <input
                className="add-item-ctrl"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
              />
            </div>
            <div className="container input-container">

              <textarea
                className="add-item-ctrl"
                placeholder="Message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
              />
              <button
                className="add-item-ctrl"
                type="submit"
                onClick={handleSubmit}
              >Send</button>
            </div>
          </div>
        </div>

      )}
    </div>
  )
}
