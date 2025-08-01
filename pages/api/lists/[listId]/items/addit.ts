import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { isUserAuthorizedForList } from "@/lib/authorize";
// import Server from "socket.io";
// import { io } from "socket.io-client";
//import { broadcast } from '@/server';
export default async function handler(req, res) {
  const session: any = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "POST") {
    const { name } = req.body;
    const { listId } = req.query;


    if (!name) {
      return res.status(400).json({ error: "Empty item not allowed!" })
    }
    const authorized = await isUserAuthorizedForList(session.user.email, listId);
    if (!authorized) return res.status(403).json({ error: "Forbidden" });

    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: {
        items: {
          where: {
            name: name
          }
        }
      }
    });

    console.log(JSON.stringify(list))
    


    if (list.items.length === 0) {
      const item = await prisma.item.create({
        data: { name, listId, price: 0.6, status: "new", count: 1 },
      });
      return res.status(201).json(item);
    } else {
      console.log(JSON.stringify(list))
      const listCount = list.items[0].count
      const itemId = list.items[0].id
      const item = await prisma.item.update({
        where: { id: itemId },
        data: { count: listCount + 1 }
      })
      return res.status(204).end();
    }

    
  }

  res.status(405).end();
}
