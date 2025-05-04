import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const formatDateAndTime = (isoDate: string): string => {
  try {
    const parsedDate = parseISO(isoDate);
    return format(parsedDate, "MMMM d, yyyy 'at' h:mm a");
  } catch {
    return "Invalid Date";
  }
};
