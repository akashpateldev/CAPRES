import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

type UserType = null | {
  type: 'student';
  name: string;
  registrationNumber: string;
  department: string;
  rollNumber?: string;
  batch?: string;
  admissionYear?: number;
  entryType?: 'regular' | 'lateral';
  email?: string;
  avatarUrl?: string;
} | {
  type: 'faculty';
  name: string;
  employeeId: string;
  department: string;
  email?: string;
  designation?: string;
  specialization?: string;
  avatarUrl?: string;
} | {
  type: 'admin';
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
};

export function useAuth() {
  const [user, setUser] = useState<UserType>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async (authUser: User) => {
    try {
      // Get user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authUser.id)
        .single();

      if (roleError || !roleData) {
        console.error('Failed to fetch user role:', roleError);
        setUser(null);
        return;
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (profileError || !profile) {
        console.error('Failed to fetch user profile:', profileError);
        setUser(null);
        return;
      }

      const fullName = `${profile.first_name} ${profile.last_name}`.trim();

      if (roleData.role === 'admin') {
        setUser({
          type: 'admin',
          name: fullName,
          email: profile.email,
          avatarUrl: profile.avatar_url || undefined,
          role: 'admin',
        });
      } else if (roleData.role === 'student') {
        setUser({
          type: 'student',
          name: fullName,
          registrationNumber: profile.registration_number || '',
          department: profile.department || '',
          rollNumber: profile.roll_number || undefined,
          batch: profile.batch || undefined,
          admissionYear: profile.admission_year || undefined,
          entryType: profile.entry_type || undefined,
          email: profile.email,
          avatarUrl: profile.avatar_url || undefined,
        });
      } else if (roleData.role === 'faculty') {
        setUser({
          type: 'faculty',
          name: fullName,
          employeeId: profile.employee_id || '',
          department: profile.department || '',
          email: profile.email,
          avatarUrl: profile.avatar_url || undefined,
        });
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          // Use setTimeout to avoid Supabase client deadlock
          setTimeout(() => fetchUserProfile(newSession.user), 0);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // THEN check existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      if (existingSession?.user) {
        fetchUserProfile(existingSession.user);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  const login = async (credentials: { type: 'student' | 'faculty' | 'admin'; id: string; password: string }) => {
    setAuthError(null);
    setIsLoading(true);
    
    try {
      // Use edge function to handle login (resolves email from registration_number/employee_id server-side)
      const response = await supabase.functions.invoke('login', {
        body: {
          type: credentials.type,
          id: credentials.id,
          password: credentials.password,
        },
      });

      if (response.error || response.data?.error) {
        setAuthError(response.data?.error || 'Invalid credentials. Please check your ID and password.');
        setIsLoading(false);
        return;
      }

      // Set the session from the edge function response
      const { session } = response.data;
      if (session) {
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
      }
      // Auth state change listener will handle the rest
    } catch (err) {
      setAuthError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    // Verify current password by re-authenticating
    const currentEmail = session?.user?.email;
    if (!currentEmail) throw new Error('Not authenticated');

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: currentEmail,
      password: currentPassword,
    });

    if (verifyError) {
      throw new Error('Current password is incorrect');
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      throw new Error('Failed to update password');
    }
  };

  return {
    user,
    session,
    isLoading,
    authError,
    login,
    logout,
    changePassword,
    setAuthError,
  };
}
