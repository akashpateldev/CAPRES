import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, differenceInDays, isPast } from "date-fns";

interface DeadlineCardProps {
  title: string;
  deadline: Date;
  description?: string;
  isCompleted?: boolean;
  className?: string;
}

export function DeadlineCard({
  title,
  deadline,
  description,
  isCompleted,
  className,
}: DeadlineCardProps) {
  const daysRemaining = differenceInDays(deadline, new Date());
  const isOverdue = isPast(deadline) && !isCompleted;
  const isUrgent = daysRemaining <= 3 && daysRemaining >= 0;

  const getStatusColor = () => {
    if (isCompleted) return 'border-success/30 bg-success/5';
    if (isOverdue) return 'border-destructive/30 bg-destructive/5';
    if (isUrgent) return 'border-warning/30 bg-warning/5';
    return 'border-border bg-card';
  };

  const getIcon = () => {
    if (isCompleted) return <CheckCircle2 className="h-5 w-5 text-success" />;
    if (isOverdue) return <AlertTriangle className="h-5 w-5 text-destructive" />;
    if (isUrgent) return <AlertTriangle className="h-5 w-5 text-warning" />;
    return <Clock className="h-5 w-5 text-muted-foreground" />;
  };

  const getTimeText = () => {
    if (isCompleted) return 'Completed';
    if (isOverdue) return `${Math.abs(daysRemaining)} days overdue`;
    if (daysRemaining === 0) return 'Due today';
    if (daysRemaining === 1) return '1 day remaining';
    return `${daysRemaining} days remaining`;
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all duration-200",
        getStatusColor(),
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{title}</h4>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {format(deadline, 'MMM dd, yyyy')}
            </span>
            <span className="text-sm text-muted-foreground">•</span>
            <span
              className={cn(
                "text-sm font-medium",
                isCompleted && "text-success",
                isOverdue && "text-destructive",
                isUrgent && !isOverdue && "text-warning",
                !isCompleted && !isOverdue && !isUrgent && "text-muted-foreground"
              )}
            >
              {getTimeText()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
