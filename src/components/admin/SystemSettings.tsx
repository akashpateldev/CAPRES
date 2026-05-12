import { useState } from "react";
import { Save, FileType, HardDrive, Mail, Building2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface SystemSettings {
  // Institution Settings
  institutionName: string;
  departmentName: string;
  academicYear: string;
  
  // File Upload Settings
  maxReportSize: number; // in MB
  maxCodeSize: number; // in MB
  maxPresentationSize: number; // in MB
  allowedReportFormats: string;
  allowedCodeFormats: string;
  allowedPresentationFormats: string;
  
  // Submission Settings
  allowLateSubmissions: boolean;
  maxSubmissionVersions: number;
  requireAllFiles: boolean;
  
  // Notification Settings
  emailNotificationsEnabled: boolean;
  notifyOnSubmission: boolean;
  notifyOnEvaluation: boolean;
  notifyOnDeadline: boolean;
  
  // Archive Settings
  autoArchiveAfterDays: number;
  archiveVisibleToJuniors: boolean;
}

const defaultSettings: SystemSettings = {
  institutionName: "ABC Institute of Technology",
  departmentName: "Computer Science & Engineering",
  academicYear: "2024-25",
  
  maxReportSize: 10,
  maxCodeSize: 50,
  maxPresentationSize: 25,
  allowedReportFormats: ".pdf",
  allowedCodeFormats: ".zip",
  allowedPresentationFormats: ".ppt, .pptx",
  
  allowLateSubmissions: true,
  maxSubmissionVersions: 3,
  requireAllFiles: false,
  
  emailNotificationsEnabled: true,
  notifyOnSubmission: true,
  notifyOnEvaluation: true,
  notifyOnDeadline: true,
  
  autoArchiveAfterDays: 30,
  archiveVisibleToJuniors: true,
};

export function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = <K extends keyof SystemSettings>(
    key: K,
    value: SystemSettings[K]
  ) => {
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully.",
    });
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(false);
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to defaults.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Institution Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Institution Settings
          </CardTitle>
          <CardDescription>
            Configure your institution and department information
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label>Institution Name</Label>
            <Input
              value={settings.institutionName}
              onChange={(e) => updateSetting('institutionName', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Department Name</Label>
            <Input
              value={settings.departmentName}
              onChange={(e) => updateSetting('departmentName', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Current Academic Year</Label>
            <Input
              value={settings.academicYear}
              onChange={(e) => updateSetting('academicYear', e.target.value)}
              placeholder="e.g., 2024-25"
            />
          </div>
        </CardContent>
      </Card>

      {/* File Upload Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileType className="h-5 w-5" />
            File Upload Settings
          </CardTitle>
          <CardDescription>
            Configure file size limits and allowed formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* Report Settings */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Max Report Size (MB)</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={settings.maxReportSize}
                  onChange={(e) => updateSetting('maxReportSize', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Allowed Report Formats</Label>
                <Input
                  value={settings.allowedReportFormats}
                  onChange={(e) => updateSetting('allowedReportFormats', e.target.value)}
                  placeholder=".pdf"
                />
              </div>
            </div>

            <Separator />

            {/* Code Settings */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Max Source Code Size (MB)</Label>
                <Input
                  type="number"
                  min={1}
                  max={200}
                  value={settings.maxCodeSize}
                  onChange={(e) => updateSetting('maxCodeSize', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Allowed Code Formats</Label>
                <Input
                  value={settings.allowedCodeFormats}
                  onChange={(e) => updateSetting('allowedCodeFormats', e.target.value)}
                  placeholder=".zip"
                />
              </div>
            </div>

            <Separator />

            {/* Presentation Settings */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Max Presentation Size (MB)</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={settings.maxPresentationSize}
                  onChange={(e) => updateSetting('maxPresentationSize', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Allowed Presentation Formats</Label>
                <Input
                  value={settings.allowedPresentationFormats}
                  onChange={(e) => updateSetting('allowedPresentationFormats', e.target.value)}
                  placeholder=".ppt, .pptx"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submission Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Submission Settings
          </CardTitle>
          <CardDescription>
            Configure submission rules and versioning
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Allow Late Submissions</Label>
              <p className="text-sm text-muted-foreground">
                Allow students to submit after deadline during grace period
              </p>
            </div>
            <Switch
              checked={settings.allowLateSubmissions}
              onCheckedChange={(checked) => updateSetting('allowLateSubmissions', checked)}
            />
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Max Submission Versions</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={settings.maxSubmissionVersions}
                onChange={(e) => updateSetting('maxSubmissionVersions', parseInt(e.target.value) || 1)}
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of times a student can update their submission
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Require All Files</Label>
              <p className="text-sm text-muted-foreground">
                Require report, code, and presentation for final submission
              </p>
            </div>
            <Switch
              checked={settings.requireAllFiles}
              onCheckedChange={(checked) => updateSetting('requireAllFiles', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure email notifications for users
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Master switch for all email notifications
              </p>
            </div>
            <Switch
              checked={settings.emailNotificationsEnabled}
              onCheckedChange={(checked) => updateSetting('emailNotificationsEnabled', checked)}
            />
          </div>

          {settings.emailNotificationsEnabled && (
            <>
              <Separator />
              <div className="grid gap-4 pl-4">
                <div className="flex items-center justify-between">
                  <Label>Notify on Submission</Label>
                  <Switch
                    checked={settings.notifyOnSubmission}
                    onCheckedChange={(checked) => updateSetting('notifyOnSubmission', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Notify on Evaluation</Label>
                  <Switch
                    checked={settings.notifyOnEvaluation}
                    onCheckedChange={(checked) => updateSetting('notifyOnEvaluation', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Notify on Deadline Reminders</Label>
                  <Switch
                    checked={settings.notifyOnDeadline}
                    onCheckedChange={(checked) => updateSetting('notifyOnDeadline', checked)}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Archive Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Archive Settings
          </CardTitle>
          <CardDescription>
            Configure how evaluated projects are archived
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2 md:w-1/2">
            <Label>Auto-Archive After (days)</Label>
            <Input
              type="number"
              min={1}
              max={365}
              value={settings.autoArchiveAfterDays}
              onChange={(e) => updateSetting('autoArchiveAfterDays', parseInt(e.target.value) || 30)}
            />
            <p className="text-xs text-muted-foreground">
              Days after evaluation when projects are automatically moved to archive
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Archive Visible to Juniors</Label>
              <p className="text-sm text-muted-foreground">
                Allow junior students (Sem 1-6) to browse archived projects
              </p>
            </div>
            <Switch
              checked={settings.archiveVisibleToJuniors}
              onCheckedChange={(checked) => updateSetting('archiveVisibleToJuniors', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Actions */}
      <div className="flex items-center justify-end gap-4 sticky bottom-4 bg-background p-4 rounded-lg border shadow-lg">
        <Button variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} disabled={!hasChanges}>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
