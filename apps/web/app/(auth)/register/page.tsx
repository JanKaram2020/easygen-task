'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'next-view-transitions';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AlertTitle, AlertDescription, Alert } from '@/components/ui/alert';
import { toast } from 'sonner';
import { PasswordInput } from '@/components/ui/password-input';
import { LoginSchema } from '@/app/(auth)/common';
import { useState } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';

const RegisterSchema = LoginSchema.extend({
  name: z.string().min(3, 'Name must be at least 3 characters'),
});

export default function RegisterForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);
    setError('');
    try {
      const res = await new Promise((resolve, reject) =>
        setTimeout(() => {
          if (Math.random() < 0.5) {
            reject('Error');
          } else {
            resolve('Success');
          }
        }, 5 * 1000),
      );
      if (res === 'Success') {
        toast.success('You submitted the following values successfully.:', {
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(data, null, 2)}
              </code>
            </pre>
          ),
        });
      }
      if (res !== 'Success') {
        setError('Error Signing you in');
      }
    } catch (error) {
      setError('Error Signing you in');
    } finally {
      form.setValue('password', '');
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className={'flex flex-col gap-6'}
        onSubmit={form.handleSubmit(onSubmit)}
        onChange={() => {
          if (error !== '') {
            setError('');
          }
        }}
      >
        <fieldset disabled={loading}>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Create An Account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Enter your credentials below to register
            </p>
          </div>
          {error ? (
            <Alert variant="destructive" className={'mt-2'}>
              <AlertTitle>Error Happened</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <div className="grid gap-6 mt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@example.com" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={'flex flex-col gap-2'}>
              <Button type="submit" className={'w-full'}>
                <LoadingSpinner loading={loading} />
                {loading ? 'Registering' : 'Register'}
              </Button>
              <Button
                variant={'outline'}
                type="button"
                className="w-full"
                onClick={() => {
                  setError('');
                  form.reset();
                }}
              >
                Reset
              </Button>
            </div>
          </div>
          <div className="text-center text-sm mt-2">
            Already have an account?{' '}
            <Link href="/login" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
