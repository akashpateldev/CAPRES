import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { StudentDashboard } from "@/components/student/StudentDashboard";
import { FacultyDashboard } from "@/components/faculty/FacultyDashboard";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ArchiveBrowser } from "@/components/archive/ArchiveBrowser";
import { useAuth } from "@/hooks/useAuth";
import { 
  GraduationCap, 
  FileText, 
  Users, 
  Shield, 
  Clock, 
  CheckCircle2,
  Loader2
} from "lucide-react";

const Index = () => {
  const { user, isLoading, authError, login, logout, changePassword, setAuthError } = useAuth();
  const [showArchive, setShowArchive] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (credentials: { type: 'student' | 'faculty' | 'admin'; id: string; password: string }) => {
    setLoginLoading(true);
    await login(credentials);
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    setShowArchive(false);
  };

  // Show loading spinner while checking session
  if (isLoading && !loginLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show Archive Browser
  if (showArchive && user) {
    return (
      <ArchiveBrowser
        user={{
          name: user.name,
          role: user.type,
          // Semester is calculated dynamically in ArchiveBrowser if needed
        }}
        onLogout={handleLogout}
      />
    );
  }

  // Show Admin Dashboard
  if (user?.type === 'admin') {
    return (
      <AdminDashboard
        admin={{
          name: user.name,
          email: user.email,
        }}
        onLogout={handleLogout}
      />
    );
  }

  // Show Student Dashboard
  if (user?.type === 'student') {
    return (
      <StudentDashboard
        student={{
          name: user.name,
          registrationNumber: user.registrationNumber,
          department: user.department,
          rollNumber: user.rollNumber,
          batch: user.batch,
          admissionYear: user.admissionYear,
          entryType: user.entryType,
          email: user.email,
          avatarUrl: user.avatarUrl,
        }}
        onLogout={handleLogout}
      />
    );
  }

  // Show Faculty Dashboard
  if (user?.type === 'faculty') {
    return (
      <FacultyDashboard
        faculty={{
          name: user.name,
          employeeId: user.employeeId,
          department: user.department,
          email: user.email,
          designation: user.designation,
          specialization: user.specialization,
          avatarUrl: user.avatarUrl,
        }}
        onLogout={handleLogout}
      />
    );
  }

  // Show Login Page
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="container relative">
          <div className="flex min-h-screen items-center justify-center py-12">
            <div className="grid w-full max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left Side - Info */}
              <div className="hidden lg:flex lg:flex-col lg:justify-center">
                <div className="mb-8">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                    <GraduationCap className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h1 className="text-4xl font-bold text-foreground">
                    CAPRES
                  </h1>
                  <p className="mt-2 text-xl text-muted-foreground">
                    Centralized Academic Project Repository & Evaluation System
                  </p>
                </div>

                <p className="mb-8 text-lg text-muted-foreground">
                  A modern platform for submitting, evaluating, and archiving academic projects. 
                  Designed for seamless collaboration between students and faculty.
                </p>

                {/* Features */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FeatureCard
                    icon={FileText}
                    title="Project Submission"
                    description="Submit minor and major projects with version control"
                  />
                  <FeatureCard
                    icon={Users}
                    title="Faculty Evaluation"
                    description="Streamlined evaluation and grading process"
                  />
                  <FeatureCard
                    icon={Clock}
                    title="Deadline Tracking"
                    description="Never miss a submission with smart reminders"
                  />
                  <FeatureCard
                    icon={Shield}
                    title="Secure Archive"
                    description="Access past projects for learning and reference"
                  />
                </div>

                {/* Stats */}
                <div className="mt-8 flex items-center gap-8 border-t border-border pt-8">
                  <div>
                    <p className="text-3xl font-bold text-foreground">500+</p>
                    <p className="text-sm text-muted-foreground">Projects Archived</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">50+</p>
                    <p className="text-sm text-muted-foreground">Faculty Members</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">1000+</p>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div className="flex items-center justify-center">
                <LoginForm onLogin={handleLogin} isLoading={loginLoading} error={authError} onClearError={() => setAuthError(null)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 CAPRES - Department of Computer Science & Engineering</p>
          <p className="mt-1">B.Tech Final Year Project</p>
        </div>
      </footer>
    </div>
  );
};

function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-4 transition-all duration-200 hover:bg-card hover:shadow-card">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="font-medium text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default Index;
