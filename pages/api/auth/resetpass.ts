import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, password } = req.body;

  const record = await prisma.resetPassToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record || record.expires < new Date()) {
    return res.status(400).json({ error: "Token invalid or expired" });
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: record.userId },
    data: { password: hashed },
  });

  await prisma.resetPassToken.delete({ where: { token } });

  res.status(200).end();
}
