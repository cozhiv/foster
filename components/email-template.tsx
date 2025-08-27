import * as React from 'react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';


interface EmailTemplateProps {
  respondent: string;
  subject: string;
  message: string;
}

export function EmailTemplate({ respondent, subject, message }: EmailTemplateProps) {
  const { data: session, status } = useSession();
  const router = useRouter()

  if (status === "loading") return <p>Ⰿ Loading...</p>;
  if (!session) return router.push("login");
    return (
      <div>
        <h1>{respondent}</h1>
        <h2>{subject}</h2>
        <div style={{fontSize: "13pt"}}>{message}</div>
      </div>
    );
  
}