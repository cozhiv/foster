import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { RequestData } from "next/dist/server/web/types";

export default async function handler(req: RequestData, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "POST") {
    const { name } = req.body;
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    const list = await prisma.list.create({
      data: {
        name,
        users: {
          create: [{ userId: user.id }],
        },
      },
    });
    return res.status(201).json(list);
  }

  res.status(405).end();
}