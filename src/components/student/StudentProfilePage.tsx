import { ArrowLeft, User, Calendar, Hash, BookOpen, GraduationCap, Building2, Clock, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  parseRegistrationNumber, 
  calculateCurrentSemester, 
  calculateBatch, 
  getStudentEligibility,
  getGraduationYear,
  getSemesterPeriod,
  getAcademicYear,
  deriveRollNumber
} from "@/lib/studentIdentity";

interface StudentProfilePageProps {
  student: {
    name: string;
    registrationNumber: string;
    department: string;
    email?: string;
    avatarUrl?: string;
  };
  onBack: () => void;
  onEditProfile?: () => void;
}

export function StudentProfilePage({ student, onBack, onEditProfile }: StudentProfilePageProps) {
  // Parse registration number to extract identity
  const parsedReg = parseRegistrationNumber(student.registrationNumber);
  
  // All values are derived from registration number
  const admissionYear = parsedReg.isValid ? parsedReg.admissionYear : new Date().getFullYear();
  const entryType = parsedReg.isValid ? parsedReg.entryType : 'regular';
  
  // Calculate semester dynamically (not stored in DB)
  const currentSemester = calculateCurrentSemester(admissionYear, entryType);
  
  // Calculate batch
  const batch = calculateBatch(admissionYear, entryType);
  
  // Derive roll number from registration number
  const rollNumber = deriveRollNumber(student.registrationNumber);
  
  // Get eligibility
  const eligibility = getStudentEligibility(currentSemester);
  
  // Get graduation year
  const expectedGraduation = getGraduationYear(admissionYear, entryType);
  
  // Get current academic period
  const semesterPeriod = getSemesterPeriod();
  const academicYear = getAcademicYear();

  const getEligibilityDisplay = () => {
    switch (eligibility.status) {
      case 'eligible':
        return {
          icon: CheckCircle2,
          variant: 'success' as const,
        };
      case 'upcoming':
        return {
          icon: Clock,
          variant: 'warning' as const,
        };
      default:
        return {
          icon: AlertCircle,
          variant: 'info' as const,
        };
    }
  };

  const eligibilityDisplay = getEligibilityDisplay();

  const profileFields = [
    {
      icon: User,
      label: 'Full Name',
      value: student.name,
      locked: false,
    },
    {
      icon: Hash,
      label: 'Registration Number',
      value: student.registrationNumber,
      locked: true,
      description: 'University issued - cannot be changed',
    },
    {
      icon: Hash,
      label: 'Roll Number',
      value: rollNumber || 'N/A',
      locked: true,
      description: 'Derived from registration number',
    },
    {
      icon: Building2,
      label: 'Department',
      value: student.department,
      locked: true,
    },
    {
      icon: Calendar,
      label: 'Batch',
      value: batch,
      locked: true,
      description: 'Derived from admission year',
    },
    {
      icon: Calendar,
      label: 'Admission Year',
      value: admissionYear.toString(),
      locked: true,
      description: 'Extracted from registration number',
    },
    {
      icon: BookOpen,
      label: 'Current Semester',
      value: `Semester ${currentSemester}`,
      locked: true,
      description: 'Calculated automatically',
    },
    {
      icon: GraduationCap,
      label: 'Entry Type',
      value: entryType === 'lateral' ? 'Lateral Entry' : 'Regular',
      locked: true,
    },
  ];

  const getVariantStyles = (variant: 'success' | 'warning' | 'info') => {
    switch (variant) {
      case 'success':
        return 'border-success/30 bg-success/5';
      case 'warning':
        return 'border-warning/30 bg-warning/5';
      case 'info':
        return 'border-info/30 bg-info/5';
    }
  };

  const getIconStyles = (variant: 'success' | 'warning' | 'info') => {
    switch (variant) {
      case 'success':
        return 'bg-success/10 text-success';
      case 'warning':
        return 'bg-warning/10 text-warning';
      case 'info':
        return 'bg-info/10 text-info';
    }
  };

  const getBadgeVariant = (variant: 'success' | 'warning' | 'info') => {
    switch (variant) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'outline';
    }
  };

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
              View your complete identity information and eligibility status
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
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{student.name}</CardTitle>
                  <CardDescription>{student.registrationNumber}</CardDescription>
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
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">{field.label}</p>
                        {field.locked && (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <p className="font-medium text-foreground truncate">{field.value}</p>
                      {field.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{field.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Academic Period Info */}
              <div className="mt-6 rounded-lg border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Current Academic Period</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Academic Year {academicYear} • {semesterPeriod === 'odd' ? 'July - December' : 'January - June'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility Card */}
          <div className="space-y-6">
            <Card className={`${getVariantStyles(eligibilityDisplay.variant)}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${getIconStyles(eligibilityDisplay.variant)}`}>
                    <eligibilityDisplay.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Eligibility Status</CardTitle>
                    <Badge variant={getBadgeVariant(eligibilityDisplay.variant)} className="mt-1">
                      {eligibility.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {eligibility.description}
                </p>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Project Timeline</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Minor Project</span>
                      <span className={currentSemester >= 7 ? 'text-success font-medium' : 'text-muted-foreground'}>
                        Semester 7
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Major Project / Internship</span>
                      <span className={currentSemester >= 8 ? 'text-success font-medium' : 'text-muted-foreground'}>
                        Semester 8
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Academic Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Semester Progress</span>
                      <span className="font-medium text-foreground">
                        {currentSemester} / 8
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div 
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${(currentSemester / 8) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-2xl font-bold text-foreground">{Math.max(0, 8 - currentSemester)}</p>
                      <p className="text-xs text-muted-foreground">Semesters Left</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-2xl font-bold text-foreground">{expectedGraduation}</p>
                      <p className="text-xs text-muted-foreground">Graduation Year</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
