import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectTypeTag, ProjectType } from "@/components/ui/ProjectTypeTag";
import { FileUploadZone, UploadedFile } from "@/components/ui/FileUploadZone";

const projectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title must be less than 200 characters"),
  description: z.string().min(50, "Description must be at least 50 characters").max(2000, "Description must be less than 2000 characters"),
  courseCode: z.string().min(1, "Course code is required"),
  academicYear: z.string().min(1, "Academic year is required"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectSubmissionFormProps {
  semester: number;
  projectType: ProjectType;
  onCancel: () => void;
  onSubmit: (data: ProjectFormData & { files: File[] }) => void;
}

const academicYears = ['2025-26', '2024-25', '2023-24'];
const courseCodes = {
  minor: ['CS701', 'CS702', 'IT701'],
  major: ['CS801', 'CS802', 'IT801'],
};

export function ProjectSubmissionForm({
  semester,
  projectType,
  onCancel,
  onSubmit,
}: ProjectSubmissionFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      courseCode: '',
      academicYear: '2025-26',
    },
  });

  const handleSubmit = (data: ProjectFormData) => {
    // Only submit completed files without errors
    const validFiles = uploadedFiles
      .filter(f => f.status === 'complete')
      .map(f => f.file);
    onSubmit({ ...data, files: validFiles });
  };

  const isUploading = uploadedFiles.some(f => f.status === 'uploading');
  const hasValidFiles = uploadedFiles.some(f => f.status === 'complete');

  return (
    <div className="mb-8 rounded-xl border border-border bg-card p-6 animate-slide-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-foreground">
              Create {projectType === 'minor' ? 'Minor' : 'Major'} Project
            </h2>
            <ProjectTypeTag type={projectType} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Semester {semester} • Fill in your project details below
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Project Title *</Label>
          <Input
            id="title"
            placeholder="Enter a descriptive title for your project"
            {...form.register('title')}
            className="input-focus"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Project Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe your project in detail. Include objectives, technologies used, and key features."
            rows={5}
            {...form.register('description')}
            className="input-focus resize-none"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{form.formState.errors.description?.message || 'Minimum 50 characters'}</span>
            <span>{form.watch('description')?.length || 0}/2000</span>
          </div>
        </div>

        {/* Course Code & Academic Year */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Course Code *</Label>
            <Select onValueChange={(v) => form.setValue('courseCode', v)}>
              <SelectTrigger className="input-focus">
                <SelectValue placeholder="Select course code" />
              </SelectTrigger>
              <SelectContent>
                {courseCodes[projectType].map((code) => (
                  <SelectItem key={code} value={code}>{code}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.courseCode && (
              <p className="text-sm text-destructive">{form.formState.errors.courseCode.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Academic Year *</Label>
            <Select 
              defaultValue="2025-26"
              onValueChange={(v) => form.setValue('academicYear', v)}
            >
              <SelectTrigger className="input-focus">
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-3">
          <Label>Project Files</Label>
          <FileUploadZone
            files={uploadedFiles}
            onFilesChange={setUploadedFiles}
            maxFiles={5}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" variant="outline" disabled={isUploading}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button type="submit" disabled={isUploading || !hasValidFiles}>
            <Send className="mr-2 h-4 w-4" />
            Submit Project
          </Button>
        </div>
      </form>
    </div>
  );
}
