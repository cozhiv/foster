import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { isUserAuthorizedForList } from "@/lib/authorize";

export default async function handler(req, res) {
  const { userEmail } = req.body;
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  const { listId } = req.query;

  const authorized = await isUserAuthorizedForList(session.user.email, listId);

  if (!authorized) return res.status(401).json({ error: "Unauthorized" });
  if (req.method === "POST") {
    const user = await prisma.user.findUnique({ where: { email: userEmail} });
    if (!user) return res.status(404).json({ error: "User not found" });


    const relation = await prisma.userList.create({
      data: {
        userId: user.id,
        listId: listId,
      },
    });

    res.status(200).json(relation);
  }
  res.status(405).end();
}
