/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthGuard } from '@/components/AuthGuard';
import { Landing } from '@/routes/landing';
import { Login } from '@/routes/login';
import { Signup } from '@/routes/signup';
import { Dashboard } from '@/routes/dashboard';
import { LoanDetail } from '@/routes/loan-detail';
import { AdminQueue } from '@/routes/admin/queue';
import { AdminApplicationDetail } from '@/routes/admin/application-detail';
import { Apply } from '@/routes/apply';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/apply" element={<AuthGuard><Apply /></AuthGuard>} />
        <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
        <Route path="/loans/:id" element={<AuthGuard><LoanDetail /></AuthGuard>} />
        <Route path="/admin" element={<AuthGuard admin><AdminQueue /></AuthGuard>} />
        <Route path="/admin/applications/:id" element={<AuthGuard admin><AdminApplicationDetail /></AuthGuard>} />
      </Routes>
    </BrowserRouter>
  );
}
