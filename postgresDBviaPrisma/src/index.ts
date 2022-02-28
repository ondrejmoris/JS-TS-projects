import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createMe() {
  await prisma.user.create({
    data: {
      email: "mmmm@seznam.cz",
      firstName: "Ondřej",
      surname: "Moris",
      age: 23,
      phoneNumber: 123456789,
      address: {
        create: {
          city: "Mokré Lazce",
          street: "Malá Strana",
          house_number: 555,
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
