import { useState } from "react";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Users,
  Search,
  Filter,
  Loader2
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EvaluationModal } from "./EvaluationModal";
import { ProjectDetailView } from "@/components/project/ProjectDetailView";
import { FacultyProfilePage } from "./FacultyProfilePage";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { useFacultyProjects, type ProjectWithFiles } from "@/hooks/useProjects";

interface FacultyDashboardProps {
  faculty: {
    name: string;
    employeeId: string;
    department: string;
    email?: string;
    designation?: string;
    specialization?: string;
    avatarUrl?: string;
  };
  onLogout: () => void;
}

export function FacultyDashboard({ faculty, onLogout }: FacultyDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectWithFiles | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [facultyData, setFacultyData] = useState(faculty);

  const { projects, loading } = useFacultyProjects();

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.submittedBy?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesType = typeFilter === 'all' || project.projectType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const pendingCount = projects.filter(p => p.status === 'submitted' || p.status === 'under_review').length;
  const evaluatedCount = projects.filter(p => p.status === 'evaluated').length;

  // Show Profile Page
  if (showProfile) {
    return (
      <>
        <FacultyProfilePage 
          faculty={facultyData} 
          onBack={() => setShowProfile(false)}
          onEditProfile={() => setShowEditProfile(true)}
        />
        <EditProfileModal
          open={showEditProfile}
          onOpenChange={setShowEditProfile}
          profile={{
            name: facultyData.name,
            email: facultyData.email || '',
            avatarUrl: facultyData.avatarUrl,
            role: 'faculty',
          }}
          onSave={async (data) => {
            setFacultyData(prev => ({
              ...prev,
              name: data.name,
              email: data.email,
              avatarUrl: data.avatarUrl,
            }));
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={{ name: facultyData.name, role: 'faculty' }}
        onLogout={onLogout}
        onViewProfile={() => setShowProfile(true)}
      />

      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {facultyData.name}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {facultyData.employeeId} • {facultyData.department}
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Projects"
            value={loading ? '...' : projects.length}
            icon={FileText}
            description="All projects"
            variant="primary"
          />
          <StatsCard
            title="Pending Evaluation"
            value={loading ? '...' : pendingCount}
            icon={Clock}
            description="Awaiting review"
            variant="warning"
          />
          <StatsCard
            title="Evaluated"
            value={loading ? '...' : evaluatedCount}
            icon={CheckCircle2}
            description="Completed reviews"
            variant="success"
          />
          <StatsCard
            title="Students"
            value={loading ? '...' : projects.length}
            icon={Users}
            description="With submissions"
            variant="info"
          />
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-foreground">All Projects</h2>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 input-focus"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="evaluated">Evaluated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="major">Major</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading projects...
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  {...project}
                  onView={() => {
                    setSelectedProject(project);
                    setShowDetailView(true);
                  }}
                />
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No projects found</h3>
                <p className="mt-2 text-muted-foreground">
                  {projects.length === 0 ? 'No projects have been submitted yet.' : 'Try adjusting your search or filter criteria'}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Project Detail View */}
      {showDetailView && selectedProject && (
        <ProjectDetailView
          open={showDetailView}
          onOpenChange={(open) => {
            setShowDetailView(open);
            if (!open) setSelectedProject(null);
          }}
          userRole="faculty"
          onEvaluationSubmit={(projectId, marks, feedback) => {
            console.log('Evaluation submitted:', { projectId, marks, feedback });
            setShowDetailView(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
        />
      )}

      {/* Evaluation Modal */}
      {showEvaluation && selectedProject && (
        <EvaluationModal
          open={showEvaluation}
          onOpenChange={(open) => {
            setShowEvaluation(open);
            if (!open) setSelectedProject(null);
          }}
          project={{
            id: selectedProject.id,
            title: selectedProject.title,
            submittedBy: selectedProject.submittedBy || 'Unknown',
            projectType: selectedProject.projectType,
          }}
          onSubmit={(marks, comments) => {
            console.log('Evaluation submitted:', { projectId: selectedProject.id, marks, comments });
            setShowEvaluation(false);
            setSelectedProject(null);
          }}
        />
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={showEditProfile}
        onOpenChange={setShowEditProfile}
        profile={{
          name: facultyData.name,
          email: facultyData.email || '',
          avatarUrl: facultyData.avatarUrl,
          role: 'faculty',
        }}
        onSave={async (data) => {
          setFacultyData(prev => ({
            ...prev,
            name: data.name,
            email: data.email,
            avatarUrl: data.avatarUrl,
          }));
        }}
      />
    </div>
  );
}
