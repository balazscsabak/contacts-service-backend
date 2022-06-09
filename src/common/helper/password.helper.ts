import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const hashPassword = async (password: string): Promise<string> => {
  if (password.length < 1) {
    throw new InternalServerErrorException();
  }

  const rounds = 10;

  return await bcrypt.hash(password, rounds);
};

const comparePassword = async ({
  password,
  hash,
}: {
  password: string;
  hash: string;
}): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export { hashPassword, comparePassword };
