
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { isUserAuthorizedForList } from "@/lib/authorize";

export default async function handler(req, res) {
  const session: any = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  const { listId } = req.query;
  
  const authorized = await isUserAuthorizedForList(session.user.email, listId);

  if (!authorized) return res.status(403).json({ error: "Forbidden" });
  // console.log("session email: ", session.user.email)
  const list: any = await prisma.list.findUnique({
    where: { id: listId },
    include: {
      items: true,
      sales: true,
      //budget: true,
      users: {
        include: {
          user: true,
        }
      }
    },
    });

  list.users = list.users.map((user) => user.user.email)
  res.status(200).json(list);
}
