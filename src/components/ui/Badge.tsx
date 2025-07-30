import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary-100 text-primary-800',
        secondary: 'border-transparent bg-secondary-100 text-secondary-800',
        destructive: 'border-transparent bg-danger-100 text-danger-800',
        success: 'border-transparent bg-success-100 text-success-800',
        warning: 'border-transparent bg-warning-100 text-warning-800',
        outline: 'text-gray-700 border-gray-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// Status için özel badge'lar
export function StatusBadge({ status }: { status: string }) {
  const getVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'live':
      case 'approved':
      case 'paid':
      case 'completed':
        return 'success';
      case 'pending':
      case 'draft':
      case 'committee_review':
        return 'warning';
      case 'rejected':
      case 'cancelled':
      case 'failed':
        return 'destructive';
      case 'closed':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Badge variant={getVariant(status)}>
      {status}
    </Badge>
  );
}

export { Badge, badgeVariants }; 