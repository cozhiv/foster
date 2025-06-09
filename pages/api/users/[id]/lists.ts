import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const sales = await prisma.lists.findMany({
    where: { userId: Number(id) },
    include: { item: true },
  });

  res.status(200).json(sales);
}
