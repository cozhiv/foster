import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;
  const { email } = req.body; // email of user to add

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const relation = await prisma.userList.create({
    data: {
      userId: user.id,
      listId: id,
    },
  });

  res.status(200).json(relation);
}
