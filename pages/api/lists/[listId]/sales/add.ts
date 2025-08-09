import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { isUserAuthorizedForList } from "@/lib/authorize";

export default async function handler(req, res) {
  const session:any = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "POST") {
    const { name, price } = req.body;

    const userEmail = session.user.email;
    const { listId } = req.query;

    const authorized = await isUserAuthorizedForList(session.user.email, listId);
    if (!authorized) return res.status(403).json({ error: "Forbidden" });
    var sale;
    const value = parseFloat(price)
    await prisma.$transaction(async (tr) => {
      sale = await tr.sale.create({
        data: { name, listId, price: value, status: "coupled", count: 1, userEmail },
      });
      await tr.item.create({
        data: { id: sale.id, name, listId, price: value, status: "coupled", count: 1 },
      });
    })
    // const item = await prisma.sale.create({
    //   data: { name, listId, price, status: "new", count: 1, userEmail },
    // });
    

    return res.status(201).json(sale);
  }

  res.status(405).end();
}
