import type { NextApiRequest, NextApiResponse } from 'next';
import { EmailTemplate } from '../../components/email-template';
import { Resend } from 'resend';
import { resend } from "../../utils";

// const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler (req: NextApiRequest, res: NextApiResponse) {

  const {message, subject, respondent} = req.body
  const { data, error } = await resend.emails.send({
    from: `${respondent} <sendfromweb@mutlist.com>`,
    to: ['cozhiv@gmail.com'],
    subject,
    react: EmailTemplate({ message, subject, respondent }),
  });

  if (error) {
    return res.status(400).json(error);
  }

  res.status(200).json(data);
};

