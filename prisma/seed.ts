/* eslint-disable prettier/prettier */
// prisma/seed.ts

function cloneDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

export const roles = [
  {
    id: 1,
    name: 'Admin',
  },
  {
    id: 2,
    name: 'User',
  },
];

export const permissions = [
  {
    id: 1,
    role_id: 1,
    action: 'manage',
    subject: 'all',
    conditions: { created_by: '{{ id }}' },
  },
  {
    id: 2,
    role_id: 2,
    action: 'read',
    subject: 'Story',
    conditions: { created_by: '{{ id }}' },
  },
  {
    id: 3,
    role_id: 2,
    action: 'manage',
    subject: 'Story',
    conditions: { created_by: '{{ id }}' },
  },
];

export const users = [
  {
    id: 1,
    name: 'Billian',
    roleid: 1,
    email: 'billy@yopmail.com',
    password: 123456789,
  },
  {
    id: 2,
    name: 'Bennison',
    roleid: 2,
    email: 'bennison@yopmail.com',
    password: 123456789,
  },
];

async function main() {
  // create two dummy articles
  const post1 = await prisma.article.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },
    update: {},
    create: {
      title: 'Prisma Adds Support for MongoDB',
      body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      published: false,
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {},
    create: {
      title: "What's new in Prisma? (Q1/22)",
      body: 'Our engineers have been working hard, issuing new releases with many improvements...',
      description:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      published: true,
    },
  });

  console.log({ post1, post2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
