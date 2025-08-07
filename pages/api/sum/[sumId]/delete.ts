import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { isUserAuthorizedForSum } from "@/lib/authorize";

export default async function handler(req, res) {
  const session: any = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "DELETE") {
    const { sumId } = req.query;

    const authorized = await isUserAuthorizedForSum(session.user.email, sumId);

    if (!authorized) return res.status(403).json({ error: "Forbidden" });

    await prisma.list.delete({ where: { id: sumId } });
    return res.status(204).end();
  }

  res.status(405).end();
}