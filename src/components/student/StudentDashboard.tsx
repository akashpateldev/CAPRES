import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, 
  Upload, 
  Clock, 
  CheckCircle2, 
  Plus,
  BookOpen,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DeadlineCard } from "@/components/dashboard/DeadlineCard";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Button } from "@/components/ui/button";
import { ProjectSubmissionForm } from "./ProjectSubmissionForm";
import { ProjectDetailView } from "@/components/project/ProjectDetailView";
import { StudentProfilePage } from "./StudentProfilePage";
import { StudentProfileModal } from "@/components/profile/StudentProfileModal";
import { 
  parseRegistrationNumber, 
  calculateCurrentSemester, 
  calculateBatch,
  getStudentEligibility,
  generateRollNumber
} from "@/lib/studentIdentity";
import { useStudentProjects, type ProjectWithFiles } from "@/hooks/useProjects";
import { useDeadlines } from "@/hooks/useDeadlines";
import { differenceInDays } from "date-fns";

interface StudentDashboardProps {
  student: {
    name: string;
    registrationNumber: string;
    department: string;
    rollNumber?: string;
    batch?: string;
    admissionYear?: number;
    entryType?: 'regular' | 'lateral';
    email?: string;
    avatarUrl?: string;
  };
  onLogout: () => void;
}

export function StudentDashboard({ student, onLogout }: StudentDashboardProps) {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectWithFiles | null>(null);
  const [studentData, setStudentData] = useState(student);
  
  const { projects, loading: projectsLoading } = useStudentProjects(studentData.registrationNumber);
  const { deadlines: allDeadlines, loading: deadlinesLoading } = useDeadlines();

  // Parse registration number and calculate identity
  const identity = useMemo(() => {
    const parsed = parseRegistrationNumber(studentData.registrationNumber);
    const admissionYear = parsed.isValid ? parsed.admissionYear : (studentData.admissionYear || 2022);
    const entryType = parsed.isValid ? parsed.entryType : (studentData.entryType || 'regular');
    const currentSemester = calculateCurrentSemester(admissionYear, entryType);
    const batch = calculateBatch(admissionYear, entryType);
    const eligibility = getStudentEligibility(currentSemester);
    const rollNumber = studentData.rollNumber || generateRollNumber(admissionYear, entryType, 1);
    return { admissionYear, entryType, currentSemester, batch, eligibility, rollNumber };
  }, [studentData.registrationNumber, studentData.admissionYear, studentData.entryType, studentData.rollNumber]);

  const canSubmit = identity.eligibility.canSubmit;
  const projectType = identity.eligibility.projectType;

  const hasExistingProject = projects.length > 0;

  // Filter deadlines relevant to this student's project type
  const relevantDeadlines = useMemo(() => {
    const ptMap = projectType === 'minor' ? 'mini-project' : projectType === 'major' ? 'major-project' : null;
    return allDeadlines
      .filter(d => d.isActive && (!ptMap || d.projectType === ptMap))
      .map(d => ({
        title: d.name,
        deadline: new Date(d.dueDate),
        description: d.description || 'Submit before the deadline',
        isCompleted: false,
      }));
  }, [allDeadlines, projectType]);

  // Calculate days left to nearest deadline
  const daysLeft = useMemo(() => {
    const upcoming = relevantDeadlines.filter(d => differenceInDays(d.deadline, new Date()) >= 0);
    if (upcoming.length === 0) return '—';
    return String(differenceInDays(upcoming[0].deadline, new Date()));
  }, [relevantDeadlines]);

  // Show Profile Page
  if (showProfile) {
    return (
      <>
        <StudentProfilePage 
          student={{
            name: studentData.name,
            registrationNumber: studentData.registrationNumber,
            department: studentData.department,
            email: studentData.email,
            avatarUrl: studentData.avatarUrl,
          }} 
          onBack={() => setShowProfile(false)}
          onEditProfile={() => setShowEditProfile(true)}
        />
        <StudentProfileModal
           open={showEditProfile}
           onOpenChange={setShowEditProfile}
           profile={{
             name: studentData.name,
             email: studentData.email || '',
             avatarUrl: studentData.avatarUrl,
           }}
           onSaveAvatar={async (avatarUrl) => {
             setStudentData(prev => ({ ...prev, avatarUrl }));
           }}
           onSaveEmail={async (email) => {
             setStudentData(prev => ({ ...prev, email }));
           }}
           onChangePassword={async (currentPassword, newPassword) => {
             const currentEmail = studentData.email;
             if (!currentEmail) throw new Error('Not authenticated');
             const { error: verifyError } = await supabase.auth.signInWithPassword({ email: currentEmail, password: currentPassword });
             if (verifyError) throw new Error('Current password is incorrect');
             const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
             if (updateError) throw new Error('Failed to update password');
           }}
         />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={{ name: studentData.name, role: 'student', semester: identity.currentSemester }}
        onLogout={onLogout}
        onViewProfile={() => setShowProfile(true)}
      />

      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {studentData.name.split(' ')[0]}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            {studentData.registrationNumber} • {studentData.department} • Semester {identity.currentSemester}
          </p>
        </div>

        {/* Junior Student Notice */}
        {!canSubmit && (
          <div className="mb-8 rounded-xl border border-info/30 bg-info/5 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-info/10 p-2">
                <BookOpen className="h-6 w-6 text-info" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Browse Archived Projects</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  As a Semester {identity.currentSemester} student, you can explore previously submitted projects 
                  from seniors. {identity.eligibility.description}
                </p>
                <Button className="mt-4" variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Archive
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Senior Student Dashboard */}
        {canSubmit && (
          <>
            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Project Type"
                value={projectType === 'minor' ? 'Minor' : projectType === 'major' ? 'Major' : 'N/A'}
                icon={FileText}
                description={`Semester ${identity.currentSemester}`}
                variant="primary"
              />
              <StatsCard
                title="Submission Status"
                value={hasExistingProject ? projects[0].status.replace('-', ' ') : 'Not Started'}
                icon={hasExistingProject ? Clock : AlertCircle}
                description={hasExistingProject ? `${projects.length} project(s)` : 'Create your project'}
                variant={hasExistingProject ? 'warning' : 'info'}
              />
              <StatsCard
                title="Projects"
                value={projects.length}
                icon={Upload}
                description="submitted"
                variant="default"
              />
              <StatsCard
                title="Days Left"
                value={daysLeft}
                icon={Clock}
                description="Until deadline"
                variant="warning"
              />
            </div>

            {/* Action Section */}
            {!hasExistingProject && !showSubmissionForm && projectType && (
              <div className="mb-8 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Start Your {projectType === 'minor' ? 'Minor' : 'Major'} Project
                </h3>
                <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                  Create your project submission to begin. You can save as draft and return later.
                </p>
                <Button 
                  className="mt-6" 
                  size="lg"
                  onClick={() => setShowSubmissionForm(true)}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Project
                </Button>
              </div>
            )}

            {showSubmissionForm && projectType && (
              <ProjectSubmissionForm
                semester={identity.currentSemester}
                projectType={projectType!}
                onCancel={() => setShowSubmissionForm(false)}
                onSubmit={(data) => {
                  console.log('Project submitted:', data);
                  setShowSubmissionForm(false);
                }}
              />
            )}

            {/* Deadlines */}
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Upcoming Deadlines</h2>
              {deadlinesLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading deadlines...
                </div>
              ) : relevantDeadlines.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {relevantDeadlines.map((deadline, index) => (
                    <DeadlineCard key={index} {...deadline} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
              )}
            </div>
          </>
        )}

        {/* Projects */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {canSubmit ? 'Your Projects' : 'Featured Archived Projects'}
            </h2>
          </div>
          
          {projectsLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading projects...
            </div>
          ) : projects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  {...project}
                  onView={() => setSelectedProject(project)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No projects yet</h3>
              <p className="mt-2 text-muted-foreground">
                {canSubmit ? 'Create your first project to get started.' : 'No archived projects available.'}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Project Detail View */}
      {selectedProject && (
        <ProjectDetailView
          open={!!selectedProject}
          onOpenChange={(open) => !open && setSelectedProject(null)}
          project={selectedProject}
        />
      )}

      {/* Student Profile Modal */}
      <StudentProfileModal
        open={showEditProfile}
        onOpenChange={setShowEditProfile}
        profile={{
          name: studentData.name,
          email: studentData.email || '',
          avatarUrl: studentData.avatarUrl,
        }}
        onSaveAvatar={async (avatarUrl) => {
          setStudentData(prev => ({ ...prev, avatarUrl }));
        }}
        onSaveEmail={async (email) => {
          setStudentData(prev => ({ ...prev, email }));
        }}
        onChangePassword={async (currentPassword: string, newPassword: string) => {
          const currentEmail = studentData.email;
          if (!currentEmail) throw new Error('Not authenticated');
          const { error: verifyError } = await supabase.auth.signInWithPassword({ email: currentEmail, password: currentPassword });
          if (verifyError) throw new Error('Current password is incorrect');
          const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
          if (updateError) throw new Error('Failed to update password');
        }}
      />
    </div>
  );
}
