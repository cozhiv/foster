import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { isUserAuthorizedForList } from "@/lib/authorize";

export default async function handler(req, res) {
  const session: any = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "POST") {
    const { name, price = 0 } = req.body;
    const { listId } = req.query;

    const authorized = await isUserAuthorizedForList(session.user.email, listId);
    if (!authorized) return res.status(403).json({ error: "Forbidden" });

    const item = await prisma.item.create({
      data: { name, listId, price, status: "new", count: 1 },
    });


    return res.status(201).json(item);
  }

  res.status(405).end();
}
