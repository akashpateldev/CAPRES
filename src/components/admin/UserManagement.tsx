import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus, RotateCcw, UserCog, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { EditStudentModal } from "./EditStudentModal";
import { useUsers, type ManagedUser } from "@/hooks/useUsers";

export function UserManagement() {
  const { users, loading, updateUser, refetch } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "student" as 'student' | 'faculty',
    registrationNumber: "",
    employeeId: "",
    department: "Computer Science & Engineering",
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = () => {
    // TODO: Implement user creation via edge function (requires admin API)
    toast({
      title: "Not implemented",
      description: "User creation requires admin API integration.",
      variant: "destructive",
    });
    setIsCreateDialogOpen(false);
  };

  const [resetting, setResetting] = useState(false);
  const [tempPassword, setTempPassword] = useState("");

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    const specials = "@#$!";
    let pw = "";
    for (let i = 0; i < 8; i++) pw += chars[Math.floor(Math.random() * chars.length)];
    pw += specials[Math.floor(Math.random() * specials.length)];
    return pw;
  };

  const openResetDialog = (user: ManagedUser) => {
    setSelectedUser(user);
    setTempPassword(generatePassword());
    setIsResetDialogOpen(true);
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !tempPassword) return;
    setResetting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("admin-reset-password", {
        body: { userId: selectedUser.userId, newPassword: tempPassword },
      });
      if (res.error) throw res.error;
      toast({
        title: "Password reset successful",
        description: `Temporary password set for ${selectedUser.name}. Share it securely.`,
      });
    } catch (err: any) {
      toast({
        title: "Password reset failed",
        description: err?.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setResetting(false);
      setIsResetDialogOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Add a new student or faculty member to the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value: 'student' | 'faculty') => 
                        setNewUser({ ...newUser, role: value })
                      }
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="Enter full name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="Enter email address" />
                  </div>
                  {newUser.role === 'student' ? (
                    <div className="grid gap-2">
                      <Label htmlFor="regNo">Registration Number</Label>
                      <Input id="regNo" value={newUser.registrationNumber} onChange={(e) => setNewUser({ ...newUser, registrationNumber: e.target.value })} placeholder="e.g., 2201319001" />
                      <p className="text-xs text-muted-foreground">10-digit university registration number</p>
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      <Label htmlFor="empId">Employee ID</Label>
                      <Input id="empId" value={newUser.employeeId} onChange={(e) => setNewUser({ ...newUser, employeeId: e.target.value })} placeholder="e.g., FAC001" />
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" value={newUser.department} onChange={(e) => setNewUser({ ...newUser, department: e.target.value })} placeholder="Enter department" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateUser}>Create User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name, email, or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Filter by role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading users...
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'faculty' ? 'default' : 'secondary'}>
                          {user.role === 'student' ? 'Student' : 'Faculty'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {user.registrationNumber || user.employeeId}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-success text-success-foreground">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" title="Edit User"
                            onClick={() => { setSelectedUser(user); setIsEditDialogOpen(true); }}>
                            <UserCog className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Reset Password"
                            onClick={() => openResetDialog(user)}>
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <p className="mt-4 text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </CardContent>
      </Card>

      {/* Reset Password Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password for {selectedUser?.name}? They will be required to change their password on next login.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <Label className="text-sm text-muted-foreground">Temporary Password</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input type={showPassword ? "text" : "password"} value={tempPassword} readOnly className="font-mono" />
                <Button variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Share this temporary password with the user securely.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleResetPassword} disabled={resetting}>
              {resetting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Resetting...</> : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      {selectedUser && (
        <EditStudentModal
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          student={{
            id: selectedUser.id,
            name: selectedUser.name,
            email: selectedUser.email,
            registrationNumber: selectedUser.registrationNumber,
          }}
          onSave={async (data) => {
            await updateUser(selectedUser.id, { name: data.name, email: data.email });
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}
