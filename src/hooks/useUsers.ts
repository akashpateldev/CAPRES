import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ManagedUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  registrationNumber?: string;
  employeeId?: string;
  department: string;
  isActive: boolean;
  createdAt: string;
}

export function useUsers() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);

    // Fetch profiles and roles
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('user_roles').select('*'),
    ]);

    if (profilesRes.error || rolesRes.error) {
      console.error('Failed to fetch users:', profilesRes.error || rolesRes.error);
      setLoading(false);
      return;
    }

    const rolesMap = new Map<string, string>();
    (rolesRes.data || []).forEach(r => rolesMap.set(r.user_id, r.role));

    const mapped: ManagedUser[] = (profilesRes.data || [])
      .filter(p => {
        const role = rolesMap.get(p.user_id);
        return role === 'student' || role === 'faculty';
      })
      .map(p => ({
        id: p.id,
        userId: p.user_id,
        name: `${p.first_name} ${p.last_name}`.trim(),
        email: p.email,
        role: (rolesMap.get(p.user_id) || 'student') as 'student' | 'faculty',
        registrationNumber: p.registration_number || undefined,
        employeeId: p.employee_id || undefined,
        department: p.department || '',
        isActive: true,
        createdAt: p.created_at.split('T')[0],
      }));

    setUsers(mapped);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const updateUser = async (profileId: string, data: { name: string; email: string }) => {
    const [firstName, ...rest] = data.name.split(' ');
    const lastName = rest.join(' ');

    const { error } = await supabase
      .from('profiles')
      .update({ first_name: firstName, last_name: lastName, email: data.email })
      .eq('id', profileId);

    if (error) throw error;

    setUsers(prev => prev.map(u =>
      u.id === profileId ? { ...u, name: data.name, email: data.email } : u
    ));
  };

  return { users, loading, updateUser, refetch: fetchUsers };
}
