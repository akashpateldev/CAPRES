import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EvaluationModal } from "@/components/faculty/EvaluationModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, ProjectStatus } from "@/components/ui/StatusBadge";
import { ProjectTypeTag, ProjectType } from "@/components/ui/ProjectTypeTag";
import { PDFViewer } from "@/components/ui/PDFViewer";
import { CodeViewer } from "@/components/ui/CodeViewer";
import { PPTXViewer } from "@/components/ui/PPTXViewer";
import {
  Download,
  FileText,
  Code,
  Presentation,
  Globe,
  Calendar,
  User,
  Clock,
  MessageSquare,
  Award,
  ExternalLink,
  Eye,
} from "lucide-react";
import { format } from "date-fns";

interface ProjectFile {
  id: string;
  name: string;
  type: "report" | "source" | "presentation" | "website";
  size: string;
  url: string;
  uploadedAt: Date;
}

interface ProjectDetailViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole?: "student" | "faculty" | "admin";
  onEvaluationSubmit?: (projectId: string, marks: number, feedback: string) => void;
  project: {
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
    feedback?: string;
    evaluatedBy?: string;
    evaluatedAt?: Date;
    files: ProjectFile[];
    websitePreviewUrl?: string;
  };
}

const fileTypeIcons = {
  report: FileText,
  source: Code,
  presentation: Presentation,
  website: Globe,
};

const fileTypeLabels = {
  report: "Project Report",
  source: "Source Code",
  presentation: "Presentation",
  website: "Static Website",
};

export function ProjectDetailView({
  open,
  onOpenChange,
  userRole = "student",
  onEvaluationSubmit,
  project,
}: ProjectDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [previewFile, setPreviewFile] = useState<ProjectFile | null>(null);
  const [codePreviewFile, setCodePreviewFile] = useState<ProjectFile | null>(null);
  const [pptxPreviewFile, setPptxPreviewFile] = useState<ProjectFile | null>(null);
  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);

  const canEvaluate = userRole === "faculty" && 
    project.status === "submitted" && 
    project.marks === undefined;

  const handleDownload = (file: ProjectFile) => {
    // In production, this would trigger actual file download
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  const handleDownloadAll = () => {
    project.files.forEach((file) => handleDownload(file));
  };

  const getFilesByType = (type: ProjectFile["type"]) =>
    project.files.filter((f) => f.type === type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <ProjectTypeTag type={project.projectType} />
                <StatusBadge status={project.status} />
                {project.marks !== undefined && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                    <Award className="h-3 w-3 mr-1" />
                    {project.marks}/100
                  </span>
                )}
              </div>
              <DialogTitle className="text-xl">{project.title}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="overview" className="m-0">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Description
                  </h4>
                  <p className="text-foreground">{project.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Course:</span>
                      <span className="font-medium">{project.courseCode}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Semester:</span>
                      <span className="font-medium">
                        Sem {project.semester} • {project.academicYear}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Submitted by:</span>
                      <span className="font-medium">{project.submittedBy}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Submitted:</span>
                      <span className="font-medium">
                        {format(project.submittedAt, "MMM dd, yyyy")}
                      </span>
                    </div>
                    {project.evaluatedAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Evaluated:</span>
                        <span className="font-medium">
                          {format(project.evaluatedAt, "MMM dd, yyyy")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    Quick File Access
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.files.map((file) => {
                      const Icon = fileTypeIcons[file.type];
                      return (
                        <Button
                          key={file.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(file)}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {fileTypeLabels[file.type]}
                          <Download className="h-3 w-3 ml-2" />
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="files" className="m-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">
                    All Files ({project.files.length})
                  </h4>
                  <Button variant="outline" size="sm" onClick={handleDownloadAll}>
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>

                <div className="space-y-3">
                  {project.files.map((file) => {
                    const Icon = fileTypeIcons[file.type];
                    return (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {fileTypeLabels[file.type]} • {file.size} •{" "}
                              {format(file.uploadedAt, "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {file.type === "report" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPreviewFile(file)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View PDF
                            </Button>
                          )}
                          {file.type === "source" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCodePreviewFile(file)}
                            >
                              <Code className="h-4 w-4 mr-1" />
                              View Code
                            </Button>
                          )}
                          {file.type === "presentation" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPptxPreviewFile(file)}
                            >
                              <Presentation className="h-4 w-4 mr-1" />
                              View Slides
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(file)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {previewFile && (
                  <div className="mt-4 rounded-lg border border-border overflow-hidden">
                    <PDFViewer
                      url={previewFile.url}
                      fileName={previewFile.name}
                      onClose={() => setPreviewFile(null)}
                      onDownload={() => handleDownload(previewFile)}
                      embedded
                    />
                  </div>
                )}

                {codePreviewFile && (
                  <div className="mt-4 rounded-lg border border-border overflow-hidden">
                    <CodeViewer
                      url={codePreviewFile.url}
                      fileName={codePreviewFile.name}
                      onClose={() => setCodePreviewFile(null)}
                      onDownload={() => handleDownload(codePreviewFile)}
                      embedded
                    />
                  </div>
                )}

                {pptxPreviewFile && (
                  <div className="mt-4 rounded-lg border border-border overflow-hidden">
                    <PPTXViewer
                      url={pptxPreviewFile.url}
                      fileName={pptxPreviewFile.name}
                      onClose={() => setPptxPreviewFile(null)}
                      onDownload={() => handleDownload(pptxPreviewFile)}
                      embedded
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="m-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">Static Website Preview</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Sandboxed iframe rendering of the submitted static website
                    </p>
                  </div>
                  {project.websitePreviewUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(project.websitePreviewUrl, "_blank")
                      }
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in New Tab
                    </Button>
                  )}
                </div>

                {project.websitePreviewUrl ? (
                  <div className="rounded-lg border border-border overflow-hidden">
                    <div className="bg-muted px-4 py-2 border-b border-border flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-destructive/60" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-background rounded px-3 py-1 text-xs text-muted-foreground truncate">
                          {project.websitePreviewUrl}
                        </div>
                      </div>
                    </div>
                    <iframe
                      src={project.websitePreviewUrl}
                      title="Static Website Preview"
                      className="w-full h-[500px] bg-white"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border bg-muted/50 h-96 flex flex-col items-center justify-center">
                    <Globe className="h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground font-medium">
                      No Static Website Submitted
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This project doesn't include a static website preview
                    </p>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Security Notice
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    The static website is rendered in a sandboxed iframe with restricted
                    permissions. Only HTML, CSS, and client-side JavaScript are
                    allowed. Server-side code and external API calls are blocked for
                    security.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="evaluation" className="m-0">
              {project.marks !== undefined ? (
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Final Grade</p>
                        <p className="text-4xl font-bold text-primary mt-1">
                          {project.marks}
                          <span className="text-lg text-muted-foreground">/100</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Evaluated by</p>
                        <p className="font-medium">{project.evaluatedBy}</p>
                        {project.evaluatedAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(project.evaluatedAt, "MMM dd, yyyy")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {project.feedback && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Faculty Feedback
                      </h4>
                      <div className="p-4 rounded-lg bg-card border border-border">
                        <p className="text-sm leading-relaxed">{project.feedback}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-muted/50 h-64 flex flex-col items-center justify-center">
                  <Clock className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground font-medium">
                    Pending Evaluation
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This project has not been evaluated yet
                  </p>
                  {canEvaluate && (
                    <Button 
                      className="mt-4" 
                      onClick={() => setEvaluationModalOpen(true)}
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Evaluate Project
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        {canEvaluate && (
          <EvaluationModal
            open={evaluationModalOpen}
            onOpenChange={setEvaluationModalOpen}
            project={{
              id: project.id,
              title: project.title,
              submittedBy: project.submittedBy,
              projectType: project.projectType,
            }}
            onSubmit={(marks, feedback) => {
              onEvaluationSubmit?.(project.id, marks, feedback);
              setEvaluationModalOpen(false);
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
