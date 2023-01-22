import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as argon2 from 'argon2';
import { AvatarGenerator } from 'random-avatar-generator';
async function main() {
  const generator = new AvatarGenerator();

  const test = await prisma.user.create({
    data: {
      name: 'test',
      username: 'test',
      email: 'test@test.com',
      password: await argon2.hash('test'),
      avatar: generator.generateRandomAvatar(),
    },
  });
  const test2 = await prisma.user.create({
    data: {
      name: 'test2',
      username: 'test2',
      email: 'test2@test.com',
      password: await argon2.hash('test2'),
      avatar: generator.generateRandomAvatar(),
    },
  });
  const test3 = await prisma.user.create({
    data: {
      name: 'test3',
      username: 'test3',
      email: 'test3@test.com',
      password: await argon2.hash('test3'),
      avatar: generator.generateRandomAvatar(),
    },
  });
  const test4 = await prisma.user.create({
    data: {
      name: 'test4',
      username: 'test4',
      email: 'test4@test.com',
      password: await argon2.hash('test4'),
      avatar: generator.generateRandomAvatar(),
    },
  });
  const admin = await prisma.user.create({
    data: {
      name: 'admin',
      username: 'admin',
      email: 'admin@admin.com',
      password: await argon2.hash('admin'),
      isAdmin: true,
      avatar:
        'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/91/918de69a31441329600a1b55d55d673df559356c_full.jpg',
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
