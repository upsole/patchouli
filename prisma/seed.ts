import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seed = async () => {
  const user = await prisma.user.findUnique({
    where: { email: "upsol@protonmail.com" },
  });

  await prisma.entry.create({
    data: {
      title: "Primer Post",
      text: "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
      tags: { create: [{ name: "First" }, { name: "Economemetics" }] },
      user: { connect: { id: user!.id } },
    },
  });

  await prisma.entry.create({
    data: {
      title: "Numero Dos",
      text: "Consectetur quibusdam qui rerum iure dolore blanditiis Incidunt rem velit nobis dicta enim? Ratione sequi nulla illo dolore obcaecati! Saepe cum voluptates qui id voluptas Amet aliquid officia modi ratione.",
      tags: {
        connectOrCreate: [
          { where: { name: "pog" }, create: { name: "pog" } },
          {
            where: { name: "Economemetics" },
            create: { name: "Economemetics" },
          },
        ],
      },
      user: { connect: { id: user!.id } },
    },
  });

  await prisma.entry.create({
    data: {
      title: "Drei Post",
      text: "Adipisicing vitae temporibus ea nobis facilis architecto Aut nam laborum vel aliquam aperiam cumque cum. Doloremque debitis id nostrum commodi rerum inventore. Ullam necessitatibus minima deserunt sequi tempore Modi illum!",
      tags: {
        connectOrCreate: [
          { where: { name: "serious" }, create: { name: "serious" } },
          { where: { name: "rant" }, create: { name: "rant" } },
        ],
      },
      user: { connect: { id: user!.id } },
    },
  });
  //
  await prisma.entry.create({
    data: {
      title: "Vier",
      text: "Sit harum fuga beatae nesciunt excepturi accusantium quo! Nemo et ea nam aspernatur ipsam ducimus Esse molestias perspiciatis minus quaerat minima Ducimus consequatur reprehenderit assumenda laudantium fugiat. Ex fugiat exercitationem.",
      tags: {
        connectOrCreate: [
          { where: { name: "courage" }, create: { name: "courage" } },
          { where: { name: "rant" }, create: { name: "rant" } },
        ],
      },
      user: { connect: { id: user!.id } },
    },
  });
  //
  await prisma.entry.create({
    data: {
      title: "Cinq",
      text: "Dolor reprehenderit obcaecati quas nihil nulla? Sunt dolor adipisci quo fugit beatae qui Inventore nihil reiciendis voluptatum dolor fuga! Doloribus inventore vel debitis amet est Itaque dolore optio veniam assumenda",
      tags: {
        connectOrCreate: [
          { where: { name: "c++" }, create: { name: "c++" } },
          { where: { name: "tyr" }, create: { name: "tyr" } },
        ],
      },
      user: { connect: { id: user!.id } },
    },
  });
  //
  await prisma.entry.create({
    data: {
      title: "Secsto Post",
      text: "Ipsum quo tenetur voluptate corrupti laborum placeat expedita Vitae ratione consequatur cupiditate provident porro Ab ut hic tempora repudiandae iure libero, inventore? Deserunt dicta ea facilis maxime ea! Neque quam?",
      tags: {
        connectOrCreate: [
          { where: { name: "anana" }, create: { name: "anana" } },
          { where: { name: "linux" }, create: { name: "linux" } },
        ],
      },
      user: { connect: { id: user!.id } },
    },
  });
  //
  await prisma.entry.create({
    data: {
      title: "Sieben",
      text: "Consectetur aliquid perspiciatis expedita odio perspiciatis dolores blanditiis officia! Blanditiis excepturi vitae repudiandae corrupti mollitia. Laborum culpa assumenda corporis facere magni minima? Minus porro quae sapiente hic ipsam Amet laboriosam",
      tags: {
        connectOrCreate: [
          {
            where: { name: "Economemetics" },
            create: { name: "Economemetics" },
          },
          { where: { name: "anana" }, create: { name: "anana" } },
        ],
      },
      user: { connect: { id: user!.id } },
    },
  });
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
