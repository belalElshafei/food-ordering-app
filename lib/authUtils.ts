import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  createdAt: string;
}

export function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const users = localStorage.getItem('food_app_users');
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
}

export function saveStoredUsers(users: StoredUser[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('food_app_users', JSON.stringify(users));
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const users = getStoredUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
