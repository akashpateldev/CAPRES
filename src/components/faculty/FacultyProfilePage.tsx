import { ArrowLeft, User, Building2, Hash, Mail, Briefcase, Users, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface FacultyProfilePageProps {
  faculty: {
    name: string;
    employeeId: string;
    department: string;
    email?: string;
    designation?: string;
    specialization?: string;
    avatarUrl?: string;
  };
  onBack: () => void;
  onEditProfile?: () => void;
}

export function FacultyProfilePage({ faculty, onBack, onEditProfile }: FacultyProfilePageProps) {
  // Mock stats - in real app would come from database
  const stats = {
    assignedProjects: 12,
    evaluatedProjects: 45,
    studentsGuided: 28,
  };

  const profileFields = [
    {
      icon: User,
      label: 'Full Name',
      value: faculty.name,
    },
    {
      icon: Hash,
      label: 'Employee ID',
      value: faculty.employeeId,
    },
    {
      icon: Building2,
      label: 'Department',
      value: faculty.department,
    },
    {
      icon: Mail,
      label: 'Email',
      value: faculty.email || 'Not provided',
    },
    {
      icon: Briefcase,
      label: 'Designation',
      value: faculty.designation || 'Assistant Professor',
    },
    {
      icon: FileText,
      label: 'Specialization',
      value: faculty.specialization || 'Computer Science',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <p className="mt-1 text-muted-foreground">
              View and manage your faculty profile information
            </p>
          </div>
          {onEditProfile && (
            <Button onClick={onEditProfile}>
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {faculty.avatarUrl ? (
                    <img 
                      src={faculty.avatarUrl} 
                      alt={faculty.name} 
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-xl">{faculty.name}</CardTitle>
                  <CardDescription>{faculty.employeeId}</CardDescription>
                  <Badge variant="secondary" className="mt-1">Faculty</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {profileFields.map((field, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <field.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">{field.label}</p>
                      <p className="font-medium text-foreground truncate">{field.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">Assigned Projects</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">{stats.assignedProjects}</span>
                  </div>
                  
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <span className="text-sm text-muted-foreground">Evaluated Projects</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">{stats.evaluatedProjects}</span>
                  </div>
                  
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-info" />
                      <span className="text-sm text-muted-foreground">Students Guided</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">{stats.studentsGuided}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={onEditProfile}>
                  <User className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Change Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
