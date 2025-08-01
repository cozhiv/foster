import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { isUserAuthorizedForList } from "@/lib/authorize";
// import { io } from "socket.io-client";
// import { broadcast } from '@/server';

export default async function handler(req, res) {
  const session: any = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "DELETE") {
    const { listId, itemId } = req.query;

    const authorized = await isUserAuthorizedForList(session.user.email, listId);
    if (!authorized) return res.status(403).json({ error: "Forbidden" });

    await prisma.item.delete({ where: { id: itemId } });

    // const socket = io()

    // socket.on('connect', () => {
      // console.log('socket connected!')
      // socket.emit('remove', JSON.stringify(listId))
    // })

    return res.status(204).end();
  }

  res.status(405).end();
}
