import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, password, captchaToken } = req.body;
  const captchaKey = process.env.CAPTCHA_SECRET;
  const captchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${captchaKey}&response=${captchaToken}`;

  const record = await prisma.resetPassToken.findUnique({
    where: { token },
    include: { user: true },
  });

  console.log(JSON.stringify(record))

  // console.log(`{the tok} ${token}`)
  if (!record && record.expires.valueOf() < Date.now()) {
    return res.status(400).json({ error: "Token invalid or expired" });
  }

  const hashed = await bcrypt.hash(password, 12);
  // console.log(`userId ${record.userId}`)

  try {
    const cResponse = await fetch(captchaUrl, { method: "POST" });
    const cData = await cResponse.json();

    if (cData.success && cData.score > 0.5) {
      const hashed = await bcrypt.hash(password, 12);
      // console.log(`userId ${record.userId}`)

      await prisma.user.update({
        where: { id: record.userId },
        data: { password: hashed },
      });
      await prisma.resetPassToken.delete({ where: { token } });
      res.status(200).end();
    } else {
      await prisma.resetPassToken.delete({ where: { token } });
      return res.status(200).json({ success: false, error: `Captcha: ${cData.score} score.` });
    }
  } catch (err) {
    console.error("Error", err);
    // await prisma.resetPassToken.delete({ where: { token } });
    return res.status(500).json({ success: false, error: `Verification failed: ${err}` });
  }
  


}
