import { User } from '@prisma/client';

interface IUser {
  sender: Pick<User, 'id' | 'username'>;
}

export type ChatType = {
  id: User['id'];
  message: string;
  sender: IUser;
  senderId: User['id'];
};

export type TypingType = IUser;
