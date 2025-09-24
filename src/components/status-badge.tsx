'use client';

import { ReadingStatus } from '@prisma/client';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ReadingStatus | null;
}

const statusStyles: Record<ReadingStatus, string> = {
  LIDO: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  LENDO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  QUERO_LER: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  PAUSADO: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  ABANDONADO: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) return null;

  // Format status text (e.g., QUERO_LER -> Quero Ler)
  const formattedStatus = status
    .replace('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <span
      className={cn(
        'inline-block text-xs px-2 py-1 rounded-full whitespace-nowrap font-semibold',
        statusStyles[status]
      )}
    >
      {formattedStatus}
    </span>
  );
}
