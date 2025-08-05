import { prisma } from "@/lib/prisma";

export async function isUserAuthorizedForList(userEmail: string, listId: string): Promise<boolean> {
  
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });
  if (!user) {
    return false;
  }

  const userId = user.id;
  const userList = await prisma.userList.findUnique({
    where: {
      userId_listId: {
        userId,
        listId,
      },
    },
  });
  if (userList) {
    return true;
  }
}
