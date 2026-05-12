import { useState } from "react";
import { 
  Search, 
  BookOpen,
  Calendar,
  SlidersHorizontal
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectDetailView } from "@/components/project/ProjectDetailView";

interface ArchiveBrowserProps {
  user: {
    name: string;
    role: 'student' | 'faculty' | 'admin';
    semester?: number;
  };
  onLogout: () => void;
}

// Mock archived projects
const archivedProjects = [
  {
    id: '1',
    title: 'Smart Campus Navigation System',
    description: 'An AI-powered indoor navigation system for college campus using Bluetooth beacons and machine learning algorithms for optimal pathfinding.',
    status: 'archived' as const,
    projectType: 'major' as const,
    semester: 8,
    academicYear: '2024-25',
    courseCode: 'CS801',
    submittedBy: 'Rahul Sharma',
    submittedAt: new Date(2025, 4, 15),
    marks: 85,
    feedback: 'Excellent implementation of the navigation algorithm. The UI is intuitive and the Bluetooth beacon integration works seamlessly.',
    evaluatedBy: 'Dr. Sharma',
    evaluatedAt: new Date(2025, 4, 20),
    files: [
      { id: 'f1', name: 'ProjectReport.pdf', type: 'report' as const, size: '2.4 MB', url: '#', uploadedAt: new Date(2025, 4, 15) },
      { id: 'f2', name: 'SourceCode.zip', type: 'source' as const, size: '15.8 MB', url: '#', uploadedAt: new Date(2025, 4, 15) },
      { id: 'f3', name: 'Presentation.pptx', type: 'presentation' as const, size: '8.2 MB', url: '#', uploadedAt: new Date(2025, 4, 14) },
      { id: 'f4', name: 'Website.zip', type: 'website' as const, size: '1.2 MB', url: '#', uploadedAt: new Date(2025, 4, 15) },
    ],
    websitePreviewUrl: 'https://example.com',
  },
  {
    id: '2',
    title: 'Library Management Portal',
    description: 'A comprehensive web-based library management system with book tracking, reservations, fine management, and automated notifications.',
    status: 'archived' as const,
    projectType: 'minor' as const,
    semester: 7,
    academicYear: '2024-25',
    courseCode: 'CS701',
    submittedBy: 'Priya Patel',
    submittedAt: new Date(2025, 0, 20),
    marks: 78,
    feedback: 'Good implementation of core features. The reservation system works well. Could improve the UI/UX.',
    evaluatedBy: 'Prof. Gupta',
    evaluatedAt: new Date(2025, 0, 25),
    files: [
      { id: 'f5', name: 'FinalReport.pdf', type: 'report' as const, size: '1.8 MB', url: '#', uploadedAt: new Date(2025, 0, 20) },
      { id: 'f6', name: 'LibrarySystem.zip', type: 'source' as const, size: '8.5 MB', url: '#', uploadedAt: new Date(2025, 0, 20) },
    ],
  },
  {
    id: '3',
    title: 'Student Attendance Tracker',
    description: 'Automated attendance tracking using QR codes and facial recognition with real-time notifications to parents and administrators.',
    status: 'archived' as const,
    projectType: 'minor' as const,
    semester: 7,
    academicYear: '2023-24',
    courseCode: 'CS701',
    submittedBy: 'Amit Kumar',
    submittedAt: new Date(2024, 0, 18),
    marks: 82,
    feedback: 'Innovative approach to attendance tracking. QR code generation is efficient.',
    evaluatedBy: 'Dr. Verma',
    evaluatedAt: new Date(2024, 0, 23),
    files: [
      { id: 'f7', name: 'AttendanceReport.pdf', type: 'report' as const, size: '2.1 MB', url: '#', uploadedAt: new Date(2024, 0, 18) },
      { id: 'f8', name: 'AttendanceApp.zip', type: 'source' as const, size: '12.3 MB', url: '#', uploadedAt: new Date(2024, 0, 18) },
    ],
  },
  {
    id: '4',
    title: 'Online Exam Portal',
    description: 'A secure online examination system with anti-cheating measures, auto-grading, and detailed analytics for educators.',
    status: 'archived' as const,
    projectType: 'major' as const,
    semester: 8,
    academicYear: '2023-24',
    courseCode: 'CS801',
    submittedBy: 'Neha Singh',
    submittedAt: new Date(2024, 4, 10),
    marks: 91,
    feedback: 'Outstanding work! The anti-cheating measures are well-thought-out and the analytics dashboard is comprehensive.',
    evaluatedBy: 'Dr. Sharma',
    evaluatedAt: new Date(2024, 4, 18),
    files: [
      { id: 'f9', name: 'ExamPortalReport.pdf', type: 'report' as const, size: '3.5 MB', url: '#', uploadedAt: new Date(2024, 4, 10) },
      { id: 'f10', name: 'ExamPortal.zip', type: 'source' as const, size: '25.2 MB', url: '#', uploadedAt: new Date(2024, 4, 10) },
      { id: 'f11', name: 'Presentation.pptx', type: 'presentation' as const, size: '10.1 MB', url: '#', uploadedAt: new Date(2024, 4, 9) },
      { id: 'f12', name: 'DemoSite.zip', type: 'website' as const, size: '3.2 MB', url: '#', uploadedAt: new Date(2024, 4, 10) },
    ],
    websitePreviewUrl: 'https://example.com/exam-portal',
  },
  {
    id: '5',
    title: 'Hostel Room Allocation System',
    description: 'An automated hostel room allocation system with preference-based matching and conflict resolution algorithms.',
    status: 'archived' as const,
    projectType: 'minor' as const,
    semester: 7,
    academicYear: '2024-25',
    courseCode: 'IT701',
    submittedBy: 'Vikram Reddy',
    submittedAt: new Date(2025, 0, 25),
    marks: 75,
    feedback: 'Good implementation of the allocation algorithm. UI could be more user-friendly.',
    evaluatedBy: 'Prof. Iyer',
    evaluatedAt: new Date(2025, 0, 30),
    files: [
      { id: 'f13', name: 'HostelReport.pdf', type: 'report' as const, size: '1.5 MB', url: '#', uploadedAt: new Date(2025, 0, 25) },
      { id: 'f14', name: 'HostelSystem.zip', type: 'source' as const, size: '6.8 MB', url: '#', uploadedAt: new Date(2025, 0, 25) },
    ],
  },
  {
    id: '6',
    title: 'College Bus Tracking App',
    description: 'Real-time college bus tracking application with GPS integration, ETA predictions, and push notifications for students.',
    status: 'archived' as const,
    projectType: 'major' as const,
    semester: 8,
    academicYear: '2024-25',
    courseCode: 'IT801',
    submittedBy: 'Kavya Iyer',
    submittedAt: new Date(2025, 4, 8),
    marks: 88,
    feedback: 'Excellent GPS integration and accurate ETA predictions. The notification system is well-implemented.',
    evaluatedBy: 'Dr. Kumar',
    evaluatedAt: new Date(2025, 4, 15),
    files: [
      { id: 'f15', name: 'BusTrackingReport.pdf', type: 'report' as const, size: '2.8 MB', url: '#', uploadedAt: new Date(2025, 4, 8) },
      { id: 'f16', name: 'BusTracker.zip', type: 'source' as const, size: '18.5 MB', url: '#', uploadedAt: new Date(2025, 4, 8) },
      { id: 'f17', name: 'Demo.pptx', type: 'presentation' as const, size: '9.2 MB', url: '#', uploadedAt: new Date(2025, 4, 7) },
    ],
  },
];

export function ArchiveBrowser({ user, onLogout }: ArchiveBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<typeof archivedProjects[0] | null>(null);

  const filteredProjects = archivedProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.submittedBy?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = yearFilter === 'all' || project.academicYear === yearFilter;
    const matchesType = typeFilter === 'all' || project.projectType === typeFilter;
    const matchesCourse = courseFilter === 'all' || project.courseCode === courseFilter;
    return matchesSearch && matchesYear && matchesType && matchesCourse;
  });

  const uniqueYears = [...new Set(archivedProjects.map(p => p.academicYear))];
  const uniqueCourses = [...new Set(archivedProjects.map(p => p.courseCode))];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user}
        onLogout={onLogout}
      />

      <main className="container py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Project Archive</h1>
          </div>
          <p className="text-muted-foreground">
            Explore past projects submitted by senior students. Learn from their work and get inspired.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{archivedProjects.length}</p>
            <p className="text-sm text-muted-foreground">Total Projects</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">
              {archivedProjects.filter(p => p.projectType === 'major').length}
            </p>
            <p className="text-sm text-muted-foreground">Major Projects</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">
              {archivedProjects.filter(p => p.projectType === 'minor').length}
            </p>
            <p className="text-sm text-muted-foreground">Minor Projects</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{uniqueYears.length}</p>
            <p className="text-sm text-muted-foreground">Academic Years</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Filters</span>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, description, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 input-focus"
              />
            </div>
            
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {uniqueYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="major">Major</SelectItem>
              </SelectContent>
            </Select>

            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {uniqueCourses.map(course => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setYearFilter('all');
                setTypeFilter('all');
                setCourseFilter('all');
              }}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {archivedProjects.length} projects
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              onView={() => setSelectedProject(project)}
              onDownload={() => console.log('Download project', project.id)}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No projects found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </main>

      {/* Project Detail View */}
      {selectedProject && (
        <ProjectDetailView
          open={!!selectedProject}
          onOpenChange={(open) => !open && setSelectedProject(null)}
          project={selectedProject}
        />
      )}
    </div>
  );
}
