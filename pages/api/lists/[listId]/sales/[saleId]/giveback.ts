import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { isUserAuthorizedForList } from "@/lib/authorize";
//import { IncomingMessage } from "http";
// interface Request extends IncomingMessage {
//   query: {listId: string, saleId: string}
// }

export default async function handler(req, res) {
  const session: any = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "DELETE") {
    const { listId, saleId } = req.query;
    const userEmail = session.user.email;
    const authorized = await isUserAuthorizedForList(userEmail, listId);
    if (!authorized) return res.status(403).json({ error: "Forbidden" });
    
    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: {
        items: {
          where: {
            id: saleId
          }
        },
        sales: {
          where: {
            id: saleId
          }
        }
      }
    });
    console.log(JSON.stringify(list))

    if (list.sales[0].count > 1) {
      await prisma.sale.update({
        where: { id: list.sales[0].id },
        data: { count: list.sales[0].count - 1 }
      })
    } else {
      await prisma.sale.delete({ where: { id: saleId } });
     

    }


    if (list.items.length > 0) {
      await prisma.item.update({
        where: { id: saleId },
        data: { count: list.items[0].count + 1 }
      })
    } else {
      await prisma.item.create({
        data: { id: saleId, name: list.sales[0].name, listId, price: 0.6, status: "new", count: 1 },
      });
    }

    return res.status(204).end();
  }

  res.status(405).end();
}
