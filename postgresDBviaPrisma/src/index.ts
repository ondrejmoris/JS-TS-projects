import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createMe() {
  await prisma.user.create({
    data: {
      email: "moris.o@seznam.cz",
      firstName: "Ondřej",
      surname: "Moris",
      age: 23,
      phoneNumber: 721590579,
      address: {
        create: {
          city: "Mokré Lazce",
          street: "Malá Strana",
          house_number: 58,
        },
      },
    },
  });
}

async function main() {
  // await createMe();

  const allUsers = await prisma.user.findMany();
  const userCnt = await prisma.user.count();

  console.log(allUsers);
  console.log(userCnt);
}

main()
  .catch((e) => {
    throw e;
  })

  .finally(async () => {
    await prisma.$disconnect();
  });
