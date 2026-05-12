import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, GraduationCap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const studentSchema = z.object({
  registrationNumber: z.string().min(1, "Registration number is required"),
  password: z.string().min(1, "Password is required"),
});

const facultySchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  password: z.string().min(1, "Password is required"),
});

const adminSchema = z.object({
  email: z.string().min(1, "Admin email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type StudentFormData = z.infer<typeof studentSchema>;
type FacultyFormData = z.infer<typeof facultySchema>;
type AdminFormData = z.infer<typeof adminSchema>;

interface LoginFormProps {
  onLogin: (credentials: { type: 'student' | 'faculty' | 'admin'; id: string; password: string }) => void;
  isLoading?: boolean;
  error?: string | null;
  onClearError?: () => void;
}

export function LoginForm({ onLogin, isLoading, error, onClearError }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'student' | 'faculty' | 'admin'>('student');

  const studentForm = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: { registrationNumber: '', password: '' },
  });

  const facultyForm = useForm<FacultyFormData>({
    resolver: zodResolver(facultySchema),
    defaultValues: { employeeId: '', password: '' },
  });

  const adminForm = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: { email: '', password: '' },
  });

  const onStudentSubmit = (data: StudentFormData) => {
    onLogin({ type: 'student', id: data.registrationNumber, password: data.password });
  };

  const onFacultySubmit = (data: FacultyFormData) => {
    onLogin({ type: 'faculty', id: data.employeeId, password: data.password });
  };

  const onAdminSubmit = (data: AdminFormData) => {
    onLogin({ type: 'admin', id: data.email, password: data.password });
  };

  return (
    <div className="w-full max-w-md animate-slide-up">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
          <GraduationCap className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Welcome to CAPRES</h1>
        <p className="mt-2 text-muted-foreground">
          Centralized Academic Project Repository & Evaluation System
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as 'student' | 'faculty' | 'admin'); onClearError?.(); }}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="student" className="space-y-4">
            <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  placeholder="Enter your registration number"
                  {...studentForm.register('registrationNumber')}
                  className="input-focus"
                />
                {studentForm.formState.errors.registrationNumber && (
                  <p className="text-sm text-destructive">
                    {studentForm.formState.errors.registrationNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentPassword">Password</Label>
                <div className="relative">
                  <Input
                    id="studentPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...studentForm.register('password')}
                    className="input-focus pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {studentForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {studentForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In as Student'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="faculty" className="space-y-4">
            <form onSubmit={facultyForm.handleSubmit(onFacultySubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  placeholder="Enter your employee ID"
                  {...facultyForm.register('employeeId')}
                  className="input-focus"
                />
                {facultyForm.formState.errors.employeeId && (
                  <p className="text-sm text-destructive">
                    {facultyForm.formState.errors.employeeId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="facultyPassword">Password</Label>
                <div className="relative">
                  <Input
                    id="facultyPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...facultyForm.register('password')}
                    className="input-focus pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {facultyForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {facultyForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In as Faculty'
                )}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="admin" className="space-y-4">
            <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@college.edu"
                  {...adminForm.register('email')}
                  className="input-focus"
                />
                {adminForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {adminForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminPassword">Password</Label>
                <div className="relative">
                  <Input
                    id="adminPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...adminForm.register('password')}
                    className="input-focus pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {adminForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {adminForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In as Admin'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Contact your department admin for password reset
        </p>
      </div>
    </div>
  );
}
