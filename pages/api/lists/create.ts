import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const session: any = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "POST") {
    const { name, budget = 0 } = req.body;
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    const list = await prisma.list.create({
      data: {
        name,
        users: {
          create: [{ userId: user.id}],
        },
        status: "new",
        budget
      },
    });
    return res.status(201).json(list);
  }

  res.status(405).end();
}