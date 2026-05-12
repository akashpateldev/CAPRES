import { cn } from "@/lib/utils";

export type ProjectStatus = 'draft' | 'submitted' | 'under_review' | 'evaluated' | 'archived' | 'revision_requested';

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  draft: {
    label: 'Draft',
    className: 'bg-muted text-muted-foreground border-border',
  },
  submitted: {
    label: 'Submitted',
    className: 'bg-info/10 text-info border-info/30',
  },
  under_review: {
    label: 'Under Review',
    className: 'bg-warning/10 text-warning border-warning/30',
  },
  evaluated: {
    label: 'Evaluated',
    className: 'bg-success/10 text-success border-success/30',
  },
  archived: {
    label: 'Archived',
    className: 'bg-primary/10 text-primary border-primary/30',
  },
  revision_requested: {
    label: 'Revision Requested',
    className: 'bg-destructive/10 text-destructive border-destructive/30',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
