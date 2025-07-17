import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { isUserAuthorizedForList } from "@/lib/authorize";
import type { NextRequest } from "next/server";
import { IncomingMessage } from "http";
interface Request extends IncomingMessage {
  query: {listId: string, itemId: string}
}

export default async function handler(req: Request, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "DELETE") {
    const { listId, itemId } = req.query;
    const userEmail = session.user.email;
    const authorized = await isUserAuthorizedForList(userEmail, listId);
    if (!authorized) return res.status(403).json({ error: "Forbidden" });
    
    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: {
        items: {
          where: {
            id: itemId
          }
        },
        sales: {
          where: {
            id: itemId
          }
        }
      }
    });
    console.log(JSON.stringify(list))

    if (list.sales.length > 0) {
      await prisma.sale.update({
        where: { id: list.sales[0].id },
        data: { count: list.sales[0].count + 1 }
      })
    } else {
      await prisma.sale.create({
        data: { id: itemId, name: list.items[0].name, listId, price: 0.6, status: "new", userEmail, count: 1},
      });

    }


    if (list.items[0].count > 1) {
      await prisma.item.update({
        where: { id: itemId },
        data: { count: list.items[0].count - 1 }
      })
    } else {
      await prisma.item.delete({ where: { id: itemId } });
    }

    return res.status(204).end();
  }

  res.status(405).end();
}
