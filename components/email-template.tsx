import * as React from 'react';

interface EmailTemplateProps {
  respondent: string;
  subject: string;
  message: string;
}

export function EmailTemplate({ respondent, subject, message }: EmailTemplateProps) {
  return (
    <div>
      <h1>WHO? - {respondent}</h1>
      <h2>{subject}</h2>
      <h4>{message}</h4>
    </div>
  );
}