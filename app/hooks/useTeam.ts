"use client";

import { useEffect, useState } from "react";

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
      const res = await fetch("/api/team/members");
      const json = await res.json();
      if (res.ok) setMembers(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    const res = await fetch("/api/departments");
    const json = await res.json();
    if (res.ok) setDepartments(json.data || []);
  };

  const fetchRoles = async () => {
    const res = await fetch("/api/roles");
    const json = await res.json();
    if (res.ok) setRoles(json.data || []);
  };

  const fetchMemberRoles = async (memberId: number) => {
    setLoadingRoles(true);
    try {
      const res = await fetch(`/api/team/roles?memberId=${memberId}`);
      const json = await res.json();
      if (res.ok) setMemberRoles(json.data || []);
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

      const res = await fetch("/api/team", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Failed to add member");

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

      const res = await fetch("/api/team", { method: "PUT", body: fd });
      if (!res.ok) throw new Error("Failed to update member");

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
      const res = await fetch("/api/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete member");

      setSuccess("Member deleted");
      fetchMembers();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const deleteProfilePicture = async (id: number) => {
    try {
      const res = await fetch("/api/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete picture");

      setSuccess("Profile picture removed");
      fetchMembers();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const addRole = async (
    memberId: number,
    departmentId: number,
    roleId: number
  ) => {
    try {
      const res = await fetch("/api/team/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_member_id: memberId,
          department_id: departmentId,
          role_id: roleId,
        }),
      });

      if (!res.ok) throw new Error("Failed to add role");

      setSuccess("Role added");
      fetchMemberRoles(memberId);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const removeRole = async (
    memberId: number,
    departmentId: number,
    roleId: number
  ) => {
    try {
      const res = await fetch("/api/team/roles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_member_id: memberId,
          department_id: departmentId,
          role_id: roleId,
        }),
      });

      if (!res.ok) throw new Error("Failed to remove role");

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
