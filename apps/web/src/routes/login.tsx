/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginInput, type LoginInput as LoginInputT } from '@lms/shared';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export function Login() {
  const form = useForm<LoginInputT>({ resolver: zodResolver(LoginInput) });
  const login = useLogin();
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-muted">
      <Card className="max-w-sm w-full">
        <CardHeader><CardTitle>Sign in</CardTitle></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => login.mutate(v, {
              onError: (e) => toast.error((e as Error).message),
            }))} className="space-y-3">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={login.isPending}>{login.isPending ? 'Signing in…' : 'Sign in'}</Button>
              <p className="text-sm text-muted-foreground text-center">No account? <Link to="/signup" className="underline">Sign up</Link></p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
