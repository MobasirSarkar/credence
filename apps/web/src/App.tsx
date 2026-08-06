/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

import { Landing } from '@/routes/landing';
import { Login } from '@/routes/login';
import { Signup } from '@/routes/signup';
import { Dashboard } from '@/routes/dashboard';
import { LoanDetail } from '@/routes/loan-detail';
import { UnderwritingReview } from '@/routes/admin/underwriting-review';
import { ApplicationReview } from '@/routes/admin/application-review';
import { Apply } from '@/routes/apply';
import { SESSION_EXPIRED_EVENT } from '@/lib/api';
import { AuthGuard } from './components/auth-guard/AuthGuard';

const PUBLIC_PATHS = ['/', '/login', '/signup'];

function SessionExpiredListener() {
  const nav = useNavigate();
  const qc = useQueryClient();
  useEffect(() => {
    const onExpired = () => {
      qc.removeQueries({ queryKey: ['me'] });
      qc.removeQueries({ queryKey: ['loans'] });
      qc.removeQueries({ queryKey: ['applications'] });
      const path = window.location.pathname;
      if (!PUBLIC_PATHS.includes(path)) {
        nav('/login', { replace: true });
      }
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, [nav, qc]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <SessionExpiredListener />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/apply" element={<AuthGuard><Apply /></AuthGuard>} />
        <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
        <Route path="/loans/:id" element={<AuthGuard><LoanDetail /></AuthGuard>} />
        <Route path="/admin/review" element={<AuthGuard admin><UnderwritingReview /></AuthGuard>} />
        <Route path="/admin/review/:id" element={<AuthGuard admin><ApplicationReview /></AuthGuard>} />
      </Routes>
    </BrowserRouter>
  );
}
