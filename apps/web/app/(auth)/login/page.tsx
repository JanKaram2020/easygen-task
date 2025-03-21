'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'next-view-transitions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { PasswordInput } from '@/components/ui/password-input';
import { LoginSchema, type LoginSchemaType } from '@repo/api';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function LoginForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit = async (data: LoginSchemaType) => {
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
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-muted-foreground text-sm text-balance mb-2">
              Enter your credentials to login to your account
            </p>
          </div>
          {error ? (
            <Alert variant="destructive" className={'mb-2'}>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <div className="grid gap-6">
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
            <Button type="submit" className="w-full">
              <LoadingSpinner loading={loading} />
              {loading ? 'Logging in' : 'Login'}
            </Button>
          </div>
          <div className="text-center text-sm mt-2">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline underline-offset-4">
              Register
            </Link>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
