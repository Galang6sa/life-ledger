import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Pastikan ada kata 'export' di depan function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}