
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const session: any = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  // console.log("session email: ",session.user.email)
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      lists: {
        include: {
          list: {
            include: {
              items: true,
              users : {
                include: {
                  user: true
                }
              },
              sales: {
                include: {
                  user: true
                }
              },
            },
          },
          
        },
      },
      
    },
  });
  

  const lists = user.lists.map((ul) => ({
    ...ul.list,
    items: ul.list.items,
    users: ul.list.users.map(li => (li.user.email))
  }));

  res.status(200).json(lists);
}
