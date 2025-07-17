import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { isUserAuthorizedForList } from "@/lib/authorize";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "DELETE") {
    const { listId } = req.query;

    const authorized = await isUserAuthorizedForList(session.user.email, listId);

    if (!authorized) return res.status(403).json({ error: "Forbidden" });

    await prisma.item.deleteMany({
      where: { listId }
    });
    await prisma.sale.deleteMany({
      where: { listId }
    });
    await prisma.userList.deleteMany({
      where: { listId },
    });

    await prisma.list.delete({ where: { id: listId } });
    return res.status(204).end();
  }

  res.status(405).end();
}