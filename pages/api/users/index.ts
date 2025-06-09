import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const users = await prisma.users.findMany();
    return res.status(200).json(users);
  }

  if (req.method === "POST") {
    const { email, name } = req.body;

    try {
      const newUser = await prisma.user.create({
        data: { email, name },
      });
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(400).json({ error: `User already exists or bad input. ${error}` });
    }
  }

  return res.status(405).end(); // method not allowed
}
