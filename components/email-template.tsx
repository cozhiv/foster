import * as React from 'react';


interface EmailTemplateProps {
  user: string;
  respondent: string;
  subject: string;
  message: string;
}

export function EmailTemplate({user,  respondent, subject, message }: EmailTemplateProps) {
  
    return (
      <div>
        <h1>{user}</h1>
        <h2>({respondent})</h2>
        <h2>{subject}</h2>
        <div style={{fontSize: "13pt"}}>{message}</div>
      </div>
    );
  
}