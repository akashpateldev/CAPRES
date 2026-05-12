import { ArrowLeft, User, Mail, Shield, Settings, Users, Calendar, FileText, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdminProfilePageProps {
  admin: {
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
    createdAt?: Date;
  };
  onBack: () => void;
  onEditProfile?: () => void;
}

export function AdminProfilePage({ admin, onBack, onEditProfile }: AdminProfilePageProps) {
  // Mock stats - in real app would come from database
  const stats = {
    totalUsers: 257,
    activeDeadlines: 3,
    projectsManaged: 156,
    recentActions: 24,
  };

  const profileFields = [
    {
      icon: User,
      label: 'Full Name',
      value: admin.name,
    },
    {
      icon: Mail,
      label: 'Email Address',
      value: admin.email,
    },
    {
      icon: Shield,
      label: 'Role',
      value: admin.role || 'System Administrator',
    },
    {
      icon: Calendar,
      label: 'Account Created',
      value: admin.createdAt ? admin.createdAt.toLocaleDateString() : 'N/A',
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
            <h1 className="text-2xl font-bold text-foreground">Admin Profile</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your administrator account settings
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
                  {admin.avatarUrl ? (
                    <img 
                      src={admin.avatarUrl} 
                      alt={admin.name} 
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <Shield className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-xl">{admin.name}</CardTitle>
                  <CardDescription>{admin.email}</CardDescription>
                  <Badge className="mt-1 bg-primary">Administrator</Badge>
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

          {/* Stats & Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-primary" />
                  System Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">Total Users</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">{stats.totalUsers}</span>
                  </div>
                  
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-warning" />
                      <span className="text-sm text-muted-foreground">Active Deadlines</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">{stats.activeDeadlines}</span>
                  </div>
                  
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-info" />
                      <span className="text-sm text-muted-foreground">Projects Managed</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">{stats.projectsManaged}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-success" />
                      <span className="text-sm text-muted-foreground">Recent Actions</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">{stats.recentActions}</span>
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
                  <Settings className="mr-2 h-4 w-4" />
                  Security Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
