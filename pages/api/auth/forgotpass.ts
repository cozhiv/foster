import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { resend } from "../../../utils"

// const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  console.log(JSON.stringify(user))
  if (!user) return res.status(200).end(); // avoid revealing emails


  
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600 * 1000); // 1 hour
  await prisma.resetPassToken.create({
    data: {
      token,
      userId: user.id,
      expires,
    },
  });
  const resetUrl = `${process.env.NEXTAUTH_URL}/resetpass?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link valid for 1 hour.</p>`,
  });

  if (error) {
    console.log(JSON.stringify(error))
    return res.json({ error, status: 500 });
  }

  res.status(200).end();
}
