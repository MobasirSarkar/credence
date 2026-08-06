/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
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
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, ArrowRight } from 'lucide-react';
import { RedirectIfLoggedIn } from '@/components/redirect-if-logged-in/RedirectIfLoggedIn';
import { BrandLogo } from '@/components/brand-logo/BrandLogo';

export function Login() {
  const form = useForm<LoginInputT>({ resolver: zodResolver(LoginInput) });
  const login = useLogin();

  return (
    <>
      <RedirectIfLoggedIn />
      <main className="min-h-screen bg-[#FAF7F0] text-[#2C40A7] font-sans p-6 flex flex-col items-center justify-center relative selection:bg-[#F237A1] selection:text-white">

        <div className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#2C40A7] hover:text-[#F237A1] transition-colors mb-6">
            <ArrowLeft className="size-4 stroke-[2.5]" />
            Back to Home
          </Link>

          <div className="rounded-2xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-8 shadow-[6px_6px_0px_#2C40A7] space-y-6">

            <div className="flex items-center justify-between border-b-2 border-[#2C40A7]/20 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2C40A7]/70 block">
                  AUTHENTICATION
                </span>
                <h1 className="text-2xl font-extrabold text-[#2C40A7]">Welcome back</h1>
              </div>
              <BrandLogo size="h-9" />
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((v) =>
                  login.mutate(v, { onError: (e) => toast.error((e as Error).message) })
                )}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-mono font-bold uppercase tracking-wider text-[#2C40A7]">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input type="email" autoComplete="email" placeholder="alice@lms.dev" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-mono font-bold uppercase tracking-wider text-[#2C40A7]">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="current-password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full mt-2" disabled={login.isPending}>
                  {login.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>

                <div className="pt-3 border-t border-[#2C40A7]/20 text-center">
                  <p className="text-xs font-bold text-[#2C40A7]/80">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-[#F237A1] hover:underline font-extrabold">
                      Create one
                    </Link>
                  </p>
                </div>

              </form>
            </Form>

          </div>
        </div>
      </main>
    </>
  );
}