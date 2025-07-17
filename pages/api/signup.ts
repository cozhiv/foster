import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const validEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password, captchaToken } = req.body;
  if (!validEmail.test(email)) {
    return res.status(405).json({ error:  "Not a valid email" });
  }

  const captchaKey = process.env.CAPTCHA_SECRET;
  const captchaUrl= `https://www.google.com/recaptcha/api/siteverify?secret=${captchaKey}&response=${captchaToken}`;
  


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
