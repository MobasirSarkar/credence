/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Landing() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-muted">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl">LMS — Personal Loans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Apply in minutes. Manage your loan from one place.</p>
          <div className="flex gap-2">
            <Button render={<Link to="/signup" />}>Get started</Button>
            <Button variant="outline" render={<Link to="/login" />}>Sign in</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
