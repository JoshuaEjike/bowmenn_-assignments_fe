import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatWeight(kg: number): string {
  return `${new Intl.NumberFormat("en-US").format(kg)} kg`;
}

export function formatDistance(km: number): string {
  return `${new Intl.NumberFormat("en-US").format(km)} km`;
}

function toDate(value: string | Date): Date {
  return typeof value === "string" ? parseISO(value) : value;
}

export function formatDate(value: string | Date, pattern = "MMM d, yyyy"): string {
  const date = toDate(value);
  return isValid(date) ? format(date, pattern) : "—";
}

export function formatDateTime(value: string | Date): string {
  return formatDate(value, "MMM d, yyyy · h:mm a");
}

export function formatRelativeTime(value: string | Date): string {
  const date = toDate(value);
  return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : "—";
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}
