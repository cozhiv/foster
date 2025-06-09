import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: { email, password: hashed },
    });
    res.status(200).end();
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: "Email already exists" });
  }
}
