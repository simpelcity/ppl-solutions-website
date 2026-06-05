"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import type { Dictionary } from "@/app/i18n";
import { parseApiError, useRateLimitState } from "@/hooks/useRateLimitState";

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
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [memberRoles, setMemberRoles] = useState<MemberRole[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { isRateLimited, rateLimitSecondsRemaining, clearRateLimitCountdown, applyRateLimit } = useRateLimitState();

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
    setError(null);
    clearRateLimitCountdown();

    try {
      const res = await axios.get('/api/team/members');
      if (res.status !== 200) throw new Error(dict.errors.members.FAILED_TO_FETCH_MEMBERS, { cause: res.status });
      const data = res.data;
      setMembers(data.members || []);
    } catch (err: any) {
      const parsed = parseApiError(err, dict.errors.members.FAILED_TO_FETCH_MEMBERS);
      setError(parsed.message);
      setStatus(err.status || null);
      applyRateLimit(parsed.rateLimit);
      throw new Error(parsed.message);
    }
  };

  async function fetchDepartments() {
    setError(null);
    clearRateLimitCountdown();

    try {
      const res = await axios.get('/api/departments');
      if (res.status !== 200) throw new Error(dict.errors.team.FAILED_TO_FETCH_DEPARTMENTS, { cause: res.status });
      const data = res.data;
      setDepartments(data.departments || []);
    } catch (err: any) {
      const parsed = parseApiError(err, dict.errors.team.FAILED_TO_FETCH_DEPARTMENTS);
      setError(parsed.message);
      setStatus(err.status || null);
      applyRateLimit(parsed.rateLimit);
      throw new Error(parsed.message);
    }
  };

  async function fetchRoles() {
    try {
      const res = await axios.get('/api/roles');
      const data = res.data;
      if (res.status === 200) setRoles(data.roles || []);
    } catch (err: any) {
      const parsed = parseApiError(err, dict.errors.roles.FAILED_TO_FETCH_ROLES);
      setError(parsed.message);
      setStatus(err.status || null);
      applyRateLimit(parsed.rateLimit);
      throw new Error(parsed.message);
    }
  };

  async function fetchMemberRoles(memberId: number) {
    setError(null);
    clearRateLimitCountdown();

    try {
      const res = await axios.get(`/api/team/roles?memberId=${memberId}`);
      const data = res.data;
      if (res.status === 200) setMemberRoles(data.roles || []);
    } catch (err: any) {
      const parsed = parseApiError(err, dict.errors.roles.FAILED_TO_FETCH_ROLES);
      setError(parsed.message);
      setStatus(err.status || null);
      applyRateLimit(parsed.rateLimit);
      throw new Error(parsed.message);
    }
  };

  const createMember = async (name: string, file?: File | null) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    clearRateLimitCountdown();

    try {
      const fd = new FormData();
      fd.append("name", name);
      if (file) fd.append("file", file);

      const res = await axios.post('/api/team', fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status !== 200) throw new Error(dict.errors.team.FAILED_TO_ADD_TEAM_MEMBER, { cause: res.status });

      setSuccess(dict.success.team.TEAM_MEMBER_ADDED);
      fetchMembers();
    } catch (e: any) {
      const parsed = parseApiError(e, dict.errors.team.FAILED_TO_ADD_TEAM_MEMBER);
      setError(parsed.message);
      applyRateLimit(parsed.rateLimit);
      throw new Error(parsed.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateMember = async (id: number, name: string, file?: File | null) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    clearRateLimitCountdown();

    try {
      const fd = new FormData();
      fd.append("id", id.toString());
      fd.append("name", name);
      if (file) fd.append("file", file);

      const res = await axios.put('/api/team', fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status !== 200) throw new Error(dict.errors.team.FAILED_TO_UPDATE_TEAM_MEMBER, { cause: res.status });

      setSuccess(dict.success.team.TEAM_MEMBER_UPDATED);
      setEditingId(null);
      fetchMembers();
    } catch (e: any) {
      const parsed = parseApiError(e, dict.errors.team.FAILED_TO_UPDATE_TEAM_MEMBER);
      setError(parsed.message);
      applyRateLimit(parsed.rateLimit);
      throw new Error(parsed.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMember = async (id: number) => {
    setError(null);
    setSuccess(null);
    clearRateLimitCountdown();

    try {
      const res = await axios.delete('/api/team', { data: { id } });
      if (res.status !== 200) throw new Error(dict.errors.team.FAILED_TO_DELETE_TEAM_MEMBER, { cause: res.status });

      setSuccess(dict.success.team.TEAM_MEMBER_DELETED);
      fetchMembers();
    } catch (e: any) {
      const parsed = parseApiError(e, dict.errors.team.FAILED_TO_DELETE_TEAM_MEMBER);
      setError(parsed.message);
      applyRateLimit(parsed.rateLimit);
      throw new Error(parsed.message);
    }
  };

  const deleteProfilePicture = async (id: number) => {
    setError(null);
    setSuccess(null);
    clearRateLimitCountdown();

    try {
      const res = await axios.patch('/api/team', { id });
      if (res.status !== 200) throw new Error(dict.errors.profile.profilePicture.FAILED_TO_DELETE_PROFILE_PICTURE, { cause: res.status });

      setSuccess(dict.success.profile.profilePicture.PROFILE_PICTURE_DELETED);
      fetchMembers();
    } catch (err: any) {
      const parsed = parseApiError(err, dict.errors.profile.profilePicture.FAILED_TO_DELETE_PROFILE_PICTURE);
      setError(parsed.message);
      applyRateLimit(parsed.rateLimit);
    }
  };

  const addRole = async (memberId: number, departmentId: number, roleId: number) => {
    setError(null);
    setSuccess(null);
    clearRateLimitCountdown();

    try {
      const res = await axios.post('/api/team/roles', {
        team_member_id: memberId,
        department_id: departmentId,
        role_id: roleId,
      });
      if (res.status !== 200) throw new Error(dict.errors.roles.FAILED_TO_ADD_ROLE, { cause: res.status });

      setSuccess(dict.success.roles.ROLE_ADDED);
      fetchMemberRoles(memberId);
    } catch (e: any) {
      const parsed = parseApiError(e, dict.errors.roles.FAILED_TO_ADD_ROLE);
      setError(parsed.message);
      applyRateLimit(parsed.rateLimit);
      throw new Error(parsed.message);
    }
  };

  const removeRole = async (memberId: number, departmentId: number, roleId: number) => {
    setError(null);
    setSuccess(null);
    clearRateLimitCountdown();

    try {
      const res = await axios.delete('/api/team/roles', {
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
      const parsed = parseApiError(e, dict.errors.roles.FAILED_TO_REMOVE_ROLE);
      setError(parsed.message);
      applyRateLimit(parsed.rateLimit);
      throw new Error(parsed.message);
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
    status,
    isRateLimited,
    rateLimitSecondsRemaining,
    success,
    setEditingId,
    createMember,
    updateMember,
    deleteMember,
    deleteProfilePicture,
    addRole,
    removeRole,
    retryTeamData: async () => {
      await Promise.all([fetchMembers(), fetchDepartments(), fetchRoles()]);
      if (editingId) {
        await fetchMemberRoles(editingId);
      }
    },
  };
}
