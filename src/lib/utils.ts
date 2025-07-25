import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatUnits } from "viem"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format token balance for display
 * @param balance - Token balance as bigint
 * @param decimals - Token decimals (default: 18)
 * @param maxDecimals - Maximum decimal places to show (default: 2)
 * @returns Formatted balance string
 */
export function formatTokenBalance(
  balance: bigint | undefined,
  decimals: number = 18,
  maxDecimals: number = 2
): string {
  if (!balance) return '0';

  const formatted = Number(formatUnits(balance, decimals));

  // For very small amounts, show more decimals
  if (formatted < 0.01 && formatted > 0) {
    return formatted.toFixed(6);
  }

  // For large amounts, use compact notation
  if (formatted >= 1000000) {
    return (formatted / 1000000).toFixed(1) + 'M';
  }

  if (formatted >= 1000) {
    return (formatted / 1000).toFixed(1) + 'K';
  }

  return formatted.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals
  });
}
