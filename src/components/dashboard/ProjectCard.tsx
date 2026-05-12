import { FileText, Download, Eye, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, ProjectStatus } from "@/components/ui/StatusBadge";
import { ProjectTypeTag, ProjectType } from "@/components/ui/ProjectTypeTag";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  projectType: ProjectType;
  semester: number;
  academicYear: string;
  courseCode: string;
  submittedBy?: string;
  submittedAt?: Date;
  marks?: number;
  onView?: () => void;
  onDownload?: () => void;
  className?: string;
}

export function ProjectCard({
  title,
  description,
  status,
  projectType,
  semester,
  academicYear,
  courseCode,
  submittedBy,
  submittedAt,
  marks,
  onView,
  onDownload,
  className,
}: ProjectCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 transition-all duration-200 card-hover",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <ProjectTypeTag type={projectType} />
            <StatusBadge status={status} />
            {marks !== undefined && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                {marks}/100
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">
            {title}
          </h3>
          
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              <span>{courseCode}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Sem {semester} • {academicYear}</span>
            </div>
            {submittedBy && (
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{submittedBy}</span>
              </div>
            )}
          </div>

          {submittedAt && (
            <p className="mt-2 text-xs text-muted-foreground">
              Submitted on {format(submittedAt, 'MMM dd, yyyy at hh:mm a')}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 pt-4 border-t border-border">
        {onView && (
          <Button variant="outline" size="sm" onClick={onView}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
        )}
        {onDownload && (
          <Button variant="ghost" size="sm" onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        )}
      </div>
    </div>
  );
}
