import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password, captchaToken } = req.body;
  const captchaKey = process.env.CAPTCHA_SECRET;
  const captchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${captchaKey}&response=${captchaToken}`;

  try {
    const cResponse = await fetch(captchaUrl, { method: "POST" });
    const cData = await cResponse.json();

    if (cData.success && cData.score > 0.5) {
      const hashed = await bcrypt.hash(password, 10);
      
      await prisma.user.create({
        data: { email, password: hashed },
      });
      res.status(200).end();
    } else {
      return res.status(200).json({ success: false, error: `Captcha: ${cData.score } score.`});
    }
  } catch (err) {
    console.error("Error", err);
    return res.status(500).json({ success: false, error: `Verification failed: ${err}` });
  }
}
