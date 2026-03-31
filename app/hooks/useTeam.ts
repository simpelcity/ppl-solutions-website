"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useLang } from "@/hooks/useLang";

export interface TeamMember {
  id: number;
  name: string;
  profile_url?: string | null;
}

export interface Department {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  code: string;
}

export interface MemberRole {
  team_member_id: number;
  department: Department;
  role: Role;
}

export function useTeam() {
  const lang = useLang();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [memberRoles, setMemberRoles] = useState<MemberRole[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
    fetchDepartments();
    fetchRoles();
  }, []);

  useEffect(() => {
    if (editingId) fetchMemberRoles(editingId);
    else setMemberRoles([]);
  }, [editingId]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/team/members?lang=${lang}`);
      const json = await res.data;
      if (res.status === 200) setMembers(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    const res = await axios.get(`/api/departments?lang=${lang}`);
    const json = await res.data;
    if (res.status == 200) setDepartments(json.data || []);
  };

  const fetchRoles = async () => {
    const res = await axios.get(`/api/roles?lang=${lang}`);
    const json = await res.data;
    if (res.status === 200) setRoles(json.data || []);
  };

  const fetchMemberRoles = async (memberId: number) => {
    setLoadingRoles(true);
    try {
      const res = await axios.get(`/api/team/roles?memberId=${memberId}&lang=${lang}`);
      const json = await res.data;
      if (res.status === 200) setMemberRoles(json.data || []);
    } finally {
      setLoadingRoles(false);
    }
  };

  const createMember = async (name: string, file?: File | null) => {
    setSubmitting(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("name", name);
      if (file) fd.append("file", file);

      const res = await axios.post(`/api/team?lang=${lang}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status !== 200) throw new Error("Failed to add member");

      setSuccess("Member added successfully");
      fetchMembers();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateMember = async (id: number, name: string, file?: File | null) => {
    setSubmitting(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("id", id.toString());
      fd.append("name", name);
      if (file) fd.append("file", file);

      const res = await axios.put(`/api/team?lang=${lang}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status !== 200) throw new Error("Failed to update member");

      setSuccess("Member updated successfully");
      setEditingId(null);
      fetchMembers();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMember = async (id: number) => {
    try {
      const res = await axios.delete(`/api/team?lang=${lang}`, { data: { id } });
      if (res.status !== 200) throw new Error("Failed to delete member");

      setSuccess("Member deleted");
      fetchMembers();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const deleteProfilePicture = async (id: number) => {
    try {
      const res = await axios.patch(`/api/team?lang=${lang}`, { data: { id } });
      if (res.status !== 200) throw new Error("Failed to delete picture");

      setSuccess("Profile picture removed");
      fetchMembers();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const addRole = async (memberId: number, departmentId: number, roleId: number) => {
    try {
      const res = await axios.post(`/api/team/roles?lang=${lang}`, {
        team_member_id: memberId,
        department_id: departmentId,
        role_id: roleId,
      });
      if (res.status !== 200) throw new Error("Failed to add role");

      setSuccess("Role added");
      fetchMemberRoles(memberId);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const removeRole = async (memberId: number, departmentId: number, roleId: number) => {
    try {
      const res = await axios.delete(`/api/team/roles?lang=${lang}`, {
        data: {
          team_member_id: memberId,
          department_id: departmentId,
          role_id: roleId,
        },
      });
      if (res.status !== 200) throw new Error("Failed to remove role");

      setSuccess("Role removed");
      fetchMemberRoles(memberId);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return {
    members,
    departments,
    roles,
    memberRoles,
    loading,
    loadingRoles,
    submitting,
    editingId,
    error,
    success,
    setEditingId,
    createMember,
    updateMember,
    deleteMember,
    deleteProfilePicture,
    addRole,
    removeRole,
  };
}
