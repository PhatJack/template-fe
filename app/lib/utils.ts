import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateFakeObjectId(): string {
  // generate a 24-character hex string similar to MongoDB ObjectId
  let result = "";
  for (let i = 0; i < 24; i++) {
    result += Math.floor(Math.random() * 16).toString(16);
  }
  return result;
}