import { useState } from "react";
import { 
  Users, 
  Calendar, 
  Settings, 
  LayoutDashboard,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  LogOut,
  User,
  Loader2
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UserManagement } from "./UserManagement";
import { DeadlineConfiguration } from "./DeadlineConfiguration";
import { SystemSettings } from "./SystemSettings";
import { AdminProfilePage } from "./AdminProfilePage";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { cn } from "@/lib/utils";
import { useAdminStats } from "@/hooks/useAdminStats";

interface AdminDashboardProps {
  admin: {
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
  };
  onLogout: () => void;
}

type Tab = 'overview' | 'users' | 'deadlines' | 'settings';

export function AdminDashboard({ admin, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [adminData, setAdminData] = useState(admin);
  const { stats, loading: statsLoading } = useAdminStats();

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'users' as Tab, label: 'Users', icon: Users },
    { id: 'deadlines' as Tab, label: 'Deadlines', icon: Calendar },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  // Show Profile Page
  if (showProfile) {
    return (
      <>
        <AdminProfilePage 
          admin={adminData} 
          onBack={() => setShowProfile(false)}
          onEditProfile={() => setShowEditProfile(true)}
        />
        <EditProfileModal
          open={showEditProfile}
          onOpenChange={setShowEditProfile}
          profile={{
            name: adminData.name,
            email: adminData.email,
            avatarUrl: adminData.avatarUrl,
            role: 'admin',
          }}
          onSave={async (data) => {
            setAdminData(prev => ({
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
        user={{ name: adminData.name, role: 'admin' }}
        onLogout={onLogout}
        onViewProfile={() => setShowProfile(true)}
      />

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 min-h-[calc(100vh-4rem)] flex-col border-r border-border bg-card">
          <div className="p-4 border-b border-border">
            <p className="text-sm font-medium text-foreground">Admin Panel</p>
            <p className="text-xs text-muted-foreground">{adminData.email}</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </aside>

        {/* Mobile Tab Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
          <div className="flex items-center justify-around p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 pb-24 md:pb-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
                <p className="text-muted-foreground">Welcome back, {adminData.name}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatsCard
                  title="Total Students"
                  value={statsLoading ? '...' : stats.totalStudents}
                  icon={Users}
                />
                <StatsCard
                  title="Faculty Members"
                  value={statsLoading ? '...' : stats.totalFaculty}
                  icon={Users}
                />
                <StatsCard
                  title="Active Projects"
                  value={statsLoading ? '...' : stats.activeProjects}
                  icon={FileText}
                />
                <StatsCard
                  title="Pending Evaluations"
                  value={statsLoading ? '...' : stats.pendingEvaluations}
                  icon={Clock}
                  className="border-warning/20 bg-warning/5"
                />
                <StatsCard
                  title="Upcoming Deadlines"
                  value={statsLoading ? '...' : stats.upcomingDeadlines}
                  icon={Calendar}
                />
                <StatsCard
                  title="Late Submissions"
                  value={statsLoading ? '...' : stats.lateSubmissions}
                  icon={AlertTriangle}
                  className="border-destructive/20 bg-destructive/5"
                />
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex flex-col items-center gap-2"
                      onClick={() => setActiveTab('users')}
                    >
                      <Users className="h-6 w-6" />
                      <span>Add New User</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex flex-col items-center gap-2"
                      onClick={() => setActiveTab('deadlines')}
                    >
                      <Calendar className="h-6 w-6" />
                      <span>Set Deadline</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex flex-col items-center gap-2"
                      onClick={() => setActiveTab('users')}
                    >
                      <CheckCircle2 className="h-6 w-6" />
                      <span>Reset Password</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex flex-col items-center gap-2"
                      onClick={() => setActiveTab('settings')}
                    >
                      <Settings className="h-6 w-6" />
                      <span>System Settings</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "New user created", user: "Rahul Verma (CSE2024015)", time: "2 hours ago" },
                      { action: "Password reset", user: "Dr. Amit Patel", time: "5 hours ago" },
                      { action: "Deadline updated", user: "Major Project Final", time: "1 day ago" },
                      { action: "User deactivated", user: "Sneha Gupta (CSE2020008)", time: "2 days ago" },
                      { action: "Settings updated", user: "File size limits", time: "3 days ago" },
                    ].map((activity, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <div>
                          <p className="font-medium text-foreground">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.user}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'deadlines' && <DeadlineConfiguration />}
          {activeTab === 'settings' && <SystemSettings />}
        </main>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={showEditProfile}
        onOpenChange={setShowEditProfile}
        profile={{
          name: adminData.name,
          email: adminData.email,
          avatarUrl: adminData.avatarUrl,
          role: 'admin',
        }}
        onSave={async (data) => {
          setAdminData(prev => ({
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
