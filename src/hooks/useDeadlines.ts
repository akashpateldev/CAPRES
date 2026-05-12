import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Deadline {
  id: string;
  name: string;
  projectType: 'mini-project' | 'major-project' | 'internship';
  academicYear: string;
  dueDate: string;
  description?: string;
  isActive: boolean;
}

export function useDeadlines() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeadlines = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('deadlines')
      .select('*')
      .order('deadline_date', { ascending: true });

    if (error) {
      console.error('Failed to fetch deadlines:', error);
      setLoading(false);
      return;
    }

    setDeadlines(
      (data || []).map(d => ({
        id: d.id,
        name: d.title,
        projectType: d.project_type,
        academicYear: d.academic_year || '',
        dueDate: d.deadline_date.split('T')[0],
        description: d.description || undefined,
        isActive: d.is_active,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => { fetchDeadlines(); }, [fetchDeadlines]);

  const addDeadline = async (deadline: Omit<Deadline, 'id'>) => {
    const { data, error } = await supabase
      .from('deadlines')
      .insert({
        title: deadline.name,
        project_type: deadline.projectType,
        academic_year: deadline.academicYear || null,
        deadline_date: deadline.dueDate,
        description: deadline.description || null,
        is_active: deadline.isActive,
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: 'Failed to create deadline.', variant: 'destructive' });
      return false;
    }

    await fetchDeadlines();
    toast({ title: 'Deadline Created', description: `${deadline.name} has been added.` });
    return true;
  };

  const toggleActive = async (id: string) => {
    const dl = deadlines.find(d => d.id === id);
    if (!dl) return;

    const { error } = await supabase
      .from('deadlines')
      .update({ is_active: !dl.isActive })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update deadline.', variant: 'destructive' });
      return;
    }

    setDeadlines(prev => prev.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d));
  };

  const deleteDeadline = async (id: string) => {
    const dl = deadlines.find(d => d.id === id);
    const { error } = await supabase.from('deadlines').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete deadline.', variant: 'destructive' });
      return;
    }

    setDeadlines(prev => prev.filter(d => d.id !== id));
    toast({ title: 'Deadline Deleted', description: `${dl?.name} has been removed.` });
  };

  return { deadlines, loading, addDeadline, toggleActive, deleteDeadline, refetch: fetchDeadlines };
}
