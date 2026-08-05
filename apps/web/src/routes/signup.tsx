/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupInput, type SignupInput as SignupInputT } from '@lms/shared';
import { useSignup } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export function Signup() {
  const form = useForm<SignupInputT>({
    resolver: zodResolver(SignupInput),
    defaultValues: { email: '', password: '', fullName: '', monthlyIncome: 50_000_00 },
  });
  const signup = useSignup();
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-muted">
      <Card className="max-w-sm w-full">
        <CardHeader><CardTitle>Create your account</CardTitle></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => signup.mutate(v, {
              onError: (e) => toast.error((e as Error).message),
            }))} className="space-y-3">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem><FormLabel>Full name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="monthlyIncome" render={({ field }) => (
                <FormItem><FormLabel>Monthly income (₹)</FormLabel><FormControl><Input type="number" {...field} value={field.value / 100} onChange={(e) => field.onChange(Math.round(Number(e.target.value) * 100))} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={signup.isPending}>{signup.isPending ? 'Creating…' : 'Create account'}</Button>
              <p className="text-sm text-muted-foreground text-center">Have an account? <Link to="/login" className="underline">Sign in</Link></p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
