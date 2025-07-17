import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (!await getServerSession(req, res, authOptions)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {

    const { id } = req.query;
    const lists = await prisma.user.findUnique({
      where: { id },
      include: {
        lists: {
          include: {
            sales: true
          }
        }
      }
    })

    return res.status(200).json(lists);
  }

  res.status(405).end();
}