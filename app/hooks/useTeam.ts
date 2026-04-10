"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import type { Dictionary } from "@/app/i18n";
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

export function useTeam(dict: Dictionary) {
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

  async function fetchMembers() {
    try {
      const res = await axios.get(`/api/team/members?lang=${lang}`);
      if (res.status !== 200) throw new Error(dict.errors.members.FAILED_TO_FETCH_MEMBERS, { cause: res.status });
      const data = res.data;
      setMembers(data.members || []);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.members.FAILED_TO_FETCH_MEMBERS;
      setError(message);
      throw new Error(message);
    }
  };

  async function fetchDepartments() {
    try {
      const res = await axios.get(`/api/departments?lang=${lang}`);
      if (res.status !== 200) throw new Error(dict.errors.team.FAILED_TO_FETCH_DEPARTMENTS, { cause: res.status });
      const data = res.data;
      setDepartments(data.departments || []);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.team.FAILED_TO_FETCH_DEPARTMENTS;
      setError(message);
      throw new Error(message);
    }
  };

  async function fetchRoles() {
    const res = await axios.get(`/api/roles?lang=${lang}`);
    const data = res.data;
    if (res.status === 200) setRoles(data.roles || []);
  };

  async function fetchMemberRoles(memberId: number) {
    try {
      const res = await axios.get(`/api/team/roles?memberId=${memberId}&lang=${lang}`);
      const data = res.data;
      if (res.status === 200) setMemberRoles(data.roles || []);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.roles.FAILED_TO_FETCH_ROLES;
      setError(message);
      throw new Error(message);
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
      if (res.status !== 200) throw new Error(dict.errors.team.FAILED_TO_ADD_TEAM_MEMBER, { cause: res.status });

      setSuccess(dict.success.team.TEAM_MEMBER_ADDED);
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
      if (res.status !== 200) throw new Error(dict.errors.team.FAILED_TO_UPDATE_TEAM_MEMBER, { cause: res.status });

      setSuccess(dict.success.team.TEAM_MEMBER_UPDATED);
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
      if (res.status !== 200) throw new Error(dict.errors.team.FAILED_TO_DELETE_TEAM_MEMBER, { cause: res.status });

      setSuccess(dict.success.team.TEAM_MEMBER_DELETED);
      fetchMembers();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const deleteProfilePicture = async (id: number) => {
    try {
      const res = await axios.patch(`/api/team?lang=${lang}`, { data: { id } });
      if (res.status !== 200) throw new Error(dict.errors.profile.profilePicture.FAILED_TO_DELETE_PROFILE_PICTURE, { cause: res.status });

      setSuccess(dict.success.profile.profilePicture.PROFILE_PICTURE_DELETED);
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
      if (res.status !== 200) throw new Error(dict.errors.roles.FAILED_TO_ADD_ROLE, { cause: res.status });

      setSuccess(dict.success.roles.ROLE_ADDED);
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
      if (res.status !== 200) throw new Error(dict.errors.roles.FAILED_TO_REMOVE_ROLE, { cause: res.status });

      setSuccess(dict.success.roles.ROLE_REMOVED);
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
