import { cn } from "@/lib/utils";

export type ProjectType = 'minor' | 'major' | 'internship';

interface ProjectTypeTagProps {
  type: ProjectType;
  className?: string;
}

export function ProjectTypeTag({ type, className }: ProjectTypeTagProps) {
  const getStyles = () => {
    switch (type) {
      case 'minor':
        return "bg-accent/10 text-accent border border-accent/20";
      case 'major':
        return "bg-primary/10 text-primary border border-primary/20";
      case 'internship':
        return "bg-info/10 text-info border border-info/20";
    }
  };
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wide",
        getStyles(),
        className
      )}
    >
      {type}
    </span>
  );
}
