import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminStats {
  totalStudents: number;
  totalFaculty: number;
  activeProjects: number;
  pendingEvaluations: number;
  upcomingDeadlines: number;
  lateSubmissions: number;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalStudents: 0,
    totalFaculty: 0,
    activeProjects: 0,
    pendingEvaluations: 0,
    upcomingDeadlines: 0,
    lateSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);

      const [rolesRes, projectsRes, deadlinesRes, evalsRes] = await Promise.all([
        supabase.from('user_roles').select('role'),
        supabase.from('projects').select('id, status, submission_date'),
        supabase.from('deadlines').select('id, deadline_date, is_active'),
        supabase.from('evaluations').select('id'),
      ]);

      const roles = rolesRes.data || [];
      const projects = projectsRes.data || [];
      const deadlines = deadlinesRes.data || [];
      const evaluations = evalsRes.data || [];

      const now = new Date();

      const totalStudents = roles.filter(r => r.role === 'student').length;
      const totalFaculty = roles.filter(r => r.role === 'faculty').length;
      const activeProjects = projects.filter(p => p.status !== 'evaluated').length;
      const pendingEvaluations = projects.filter(p => p.status === 'submitted' || p.status === 'under-review').length;
      const upcomingDeadlines = deadlines.filter(d => d.is_active && new Date(d.deadline_date) > now).length;
      const lateSubmissions = projects.filter(p => {
        if (!p.submission_date) return false;
        // Count projects submitted but not yet evaluated
        return p.status === 'submitted' || p.status === 'under-review';
      }).length;

      setStats({
        totalStudents,
        totalFaculty,
        activeProjects,
        pendingEvaluations,
        upcomingDeadlines,
        lateSubmissions,
      });
      setLoading(false);
    }

    fetch();
  }, []);

  return { stats, loading };
}
