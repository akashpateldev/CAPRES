import { useState } from "react";
import { Download, Eye, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ProjectTypeTag, ProjectType } from "@/components/ui/ProjectTypeTag";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EvaluationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    id: string;
    title: string;
    submittedBy: string;
    projectType: ProjectType;
  };
  onSubmit: (marks: number, comments: string) => void;
}

const mockFiles = [
  { name: 'Project_Report.pdf', size: '2.4 MB', type: 'pdf' },
  { name: 'Source_Code.zip', size: '15.8 MB', type: 'zip' },
  { name: 'Presentation.pptx', size: '5.2 MB', type: 'pptx' },
];

export function EvaluationModal({ open, onOpenChange, project, onSubmit }: EvaluationModalProps) {
  const [marks, setMarks] = useState(70);
  const [comments, setComments] = useState('');

  const getFileIcon = (type: string) => {
    if (type === 'pdf') return '📄';
    if (type === 'zip') return '📦';
    if (type === 'pptx') return '📊';
    return '📎';
  };

  const getGradeLabel = (marks: number) => {
    if (marks >= 90) return { label: 'Outstanding', color: 'text-success' };
    if (marks >= 80) return { label: 'Excellent', color: 'text-success' };
    if (marks >= 70) return { label: 'Good', color: 'text-info' };
    if (marks >= 60) return { label: 'Satisfactory', color: 'text-warning' };
    if (marks >= 50) return { label: 'Pass', color: 'text-warning' };
    return { label: 'Needs Improvement', color: 'text-destructive' };
  };

  const grade = getGradeLabel(marks);

  const handleSubmit = () => {
    onSubmit(marks, comments);
    setMarks(70);
    setComments('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <ProjectTypeTag type={project.projectType} />
          </div>
          <DialogTitle>{project.title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Submitted by {project.submittedBy}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Files */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Submitted Files</h3>
            <div className="space-y-2">
              {mockFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getFileIcon(file.type)}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.size}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation Section */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Evaluate Project
            </h3>

            <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                <p className="text-sm text-warning font-medium">
                  Once submitted, evaluation cannot be changed. This will lock the project.
                </p>
              </div>
            </div>

            {/* Marks Slider */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Marks</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-foreground">{marks}</span>
                    <span className="text-muted-foreground">/100</span>
                    <span className={`ml-2 text-sm font-medium ${grade.color}`}>
                      ({grade.label})
                    </span>
                  </div>
                </div>
                <Slider
                  value={[marks]}
                  onValueChange={([v]) => setMarks(v)}
                  max={100}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <Label htmlFor="comments">Evaluation Comments</Label>
                <Textarea
                  id="comments"
                  placeholder="Enter your feedback and comments for the student..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Send className="mr-2 h-4 w-4" />
            Submit Evaluation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
