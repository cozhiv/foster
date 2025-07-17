// import { prisma } from "@/lib/prisma";
// import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { id } = req.query;

//   const sales = await prisma.lists.findMany({
//     where: { userId: Number(id) },
//     include: { item: true },
//   });

//   res.status(200).json(sales);
// }
// const list = await prisma.list.findUnique({
//   where: { id: listId },
//   include: {
//     items: {
//       where: {
//         id: itemId
//       }
//     },
//     sales: {
//       where: {
//         id: itemId
//       }
//     }
//   }
// });

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const { id } = req.query;

    const lists = await prisma.user.findUnique({
      where: {id}, //change email to id
      include: {
        lists: {
          include: {
            items: true
          }
        }
      }
    })

    return res.status(200).json(lists);
  }

  res.status(405).end();
}