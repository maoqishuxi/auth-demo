import { hash } from "bcrypt";

export async function generateHash(password: string): Promise<string> {
  const saltRounds: number = 10; // You can adjust the salt rounds as needed
  return await hash(password, saltRounds);
}
