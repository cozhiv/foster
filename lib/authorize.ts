import { prisma } from "@/lib/prisma";

export async function isUserAuthorizedForList(userEmail: string, listId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });
  if (!user) return false;

  const userList = await prisma.userList.findUnique({
    where: {
      userId_listId: {
        userId: user.id,
        listId,
      },
    },
  });

  return !!userList;
}