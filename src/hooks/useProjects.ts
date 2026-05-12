import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ProjectWithFiles {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'submitted' | 'under_review' | 'evaluated' | 'revision_requested' | 'archived';
  projectType: 'minor' | 'major' | 'internship';
  semester: number;
  academicYear: string;
  courseCode: string;
  submittedBy?: string;
  submittedAt?: Date;
  marks?: number;
  feedback?: string;
  evaluatedBy?: string;
  evaluatedAt?: Date;
  guideName?: string;
  teamMembers?: string[];
  tags?: string[];
  files: {
    id: string;
    name: string;
    type: 'report' | 'source' | 'presentation' | 'website';
    size: string;
    url: string;
    uploadedAt: Date;
  }[];
}

function mapProjectType(pt: string): 'minor' | 'major' | 'internship' {
  if (pt === 'mini-project') return 'minor';
  if (pt === 'major-project') return 'major';
  return 'internship';
}

function mapStatus(s: string): ProjectWithFiles['status'] {
  const map: Record<string, ProjectWithFiles['status']> = {
    'draft': 'draft',
    'submitted': 'submitted',
    'under-review': 'under_review',
    'evaluated': 'evaluated',
    'revision-requested': 'revision_requested',
  };
  return map[s] || 'draft';
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
  return `${size.toFixed(1)} ${units[i]}`;
}

export function useStudentProjects(userId?: string) {
  const [projects, setProjects] = useState<ProjectWithFiles[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    async function fetch() {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      const uid = session?.session?.user?.id;
      if (!uid) { setLoading(false); return; }

      const { data: projectRows, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (error || !projectRows) { setLoading(false); return; }

      // Fetch files and evaluations for each project
      const projectIds = projectRows.map(p => p.id);
      
      const [filesRes, evalsRes, profileRes] = await Promise.all([
        projectIds.length > 0
          ? supabase.from('project_files').select('*').in('project_id', projectIds)
          : Promise.resolve({ data: [], error: null }),
        projectIds.length > 0
          ? supabase.from('evaluations').select('*').in('project_id', projectIds)
          : Promise.resolve({ data: [], error: null }),
        supabase.from('profiles').select('first_name, last_name').eq('user_id', uid).maybeSingle(),
      ]);

      const filesMap = new Map<string, typeof filesRes.data>();
      (filesRes.data || []).forEach(f => {
        const arr = filesMap.get(f.project_id) || [];
        arr.push(f);
        filesMap.set(f.project_id, arr);
      });

      const evalsMap = new Map<string, any>();
      (evalsRes.data || []).forEach(e => {
        evalsMap.set(e.project_id, e);
      });

      const studentName = profileRes.data
        ? `${profileRes.data.first_name} ${profileRes.data.last_name}`.trim()
        : undefined;

      const mapped: ProjectWithFiles[] = projectRows.map(p => {
        const ev = evalsMap.get(p.id);
        const files = (filesMap.get(p.id) || []).map(f => ({
          id: f.id,
          name: f.file_name,
          type: f.file_type as any,
          size: formatFileSize(f.file_size),
          url: f.file_path,
          uploadedAt: new Date(f.created_at),
        }));

        const semNum = p.semester ? parseInt(p.semester) : 0;
        const courseCode = p.project_type === 'mini-project' ? 'CS701' : p.project_type === 'major-project' ? 'CS801' : 'CS800';

        return {
          id: p.id,
          title: p.title,
          description: p.description || '',
          status: mapStatus(p.status),
          projectType: mapProjectType(p.project_type),
          semester: semNum || 8,
          academicYear: p.academic_year || '',
          courseCode,
          submittedBy: studentName,
          submittedAt: p.submission_date ? new Date(p.submission_date) : undefined,
          marks: ev?.marks || undefined,
          feedback: ev?.comments || undefined,
          evaluatedAt: ev?.evaluated_at ? new Date(ev.evaluated_at) : undefined,
          guideName: p.guide_name || undefined,
          teamMembers: p.team_members || undefined,
          tags: p.tags || undefined,
          files,
        };
      });

      setProjects(mapped);
      setLoading(false);
    }

    fetch();
  }, [userId]);

  return { projects, loading };
}

export function useFacultyProjects() {
  const [projects, setProjects] = useState<ProjectWithFiles[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      const uid = session?.session?.user?.id;
      if (!uid) { setLoading(false); return; }

      // Faculty can see all projects (RLS allows it)
      const { data: projectRows, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !projectRows) { setLoading(false); return; }

      const projectIds = projectRows.map(p => p.id);
      const userIds = [...new Set(projectRows.map(p => p.user_id))];

      const [filesRes, evalsRes, profilesRes] = await Promise.all([
        projectIds.length > 0
          ? supabase.from('project_files').select('*').in('project_id', projectIds)
          : Promise.resolve({ data: [], error: null }),
        projectIds.length > 0
          ? supabase.from('evaluations').select('*').in('project_id', projectIds)
          : Promise.resolve({ data: [], error: null }),
        userIds.length > 0
          ? supabase.from('profiles').select('user_id, first_name, last_name').in('user_id', userIds)
          : Promise.resolve({ data: [], error: null }),
      ]);

      const filesMap = new Map<string, any[]>();
      (filesRes.data || []).forEach(f => {
        const arr = filesMap.get(f.project_id) || [];
        arr.push(f);
        filesMap.set(f.project_id, arr);
      });

      const evalsMap = new Map<string, any>();
      (evalsRes.data || []).forEach(e => {
        evalsMap.set(e.project_id, e);
      });

      const profilesMap = new Map<string, string>();
      (profilesRes.data || []).forEach(p => {
        profilesMap.set(p.user_id, `${p.first_name} ${p.last_name}`.trim());
      });

      const mapped: ProjectWithFiles[] = projectRows.map(p => {
        const ev = evalsMap.get(p.id);
        const files = (filesMap.get(p.id) || []).map(f => ({
          id: f.id,
          name: f.file_name,
          type: f.file_type as any,
          size: formatFileSize(f.file_size),
          url: f.file_path,
          uploadedAt: new Date(f.created_at),
        }));

        const semNum = p.semester ? parseInt(p.semester) : 0;
        const courseCode = p.project_type === 'mini-project' ? 'CS701' : p.project_type === 'major-project' ? 'CS801' : 'CS800';

        return {
          id: p.id,
          title: p.title,
          description: p.description || '',
          status: mapStatus(p.status),
          projectType: mapProjectType(p.project_type),
          semester: semNum || 8,
          academicYear: p.academic_year || '',
          courseCode,
          submittedBy: profilesMap.get(p.user_id) || 'Unknown',
          submittedAt: p.submission_date ? new Date(p.submission_date) : undefined,
          marks: ev?.marks || undefined,
          feedback: ev?.comments || undefined,
          evaluatedAt: ev?.evaluated_at ? new Date(ev.evaluated_at) : undefined,
          guideName: p.guide_name || undefined,
          teamMembers: p.team_members || undefined,
          tags: p.tags || undefined,
          files,
        };
      });

      setProjects(mapped);
      setLoading(false);
    }

    fetch();
  }, []);

  return { projects, loading };
}
