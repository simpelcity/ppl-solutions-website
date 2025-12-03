'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function DriversHubPage() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push('/login');
    }
  }, [session, loading, router]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="p-4">
      <h1>Drivers Hub</h1>
      <p>Welcome, {session.user.email}</p>
    </div>
  );
}
