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
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useSearchParams, useRouter } from 'next/navigation';

const ErrorMessages = {
  default: 'Error Happened while registering. try again later.',
  401: <p>Invalid Credentials. Email or password is incorrect. </p>,
} as const;

export default function LoginForm() {
  const searchParams = useSearchParams();
  const emailInitialValue = searchParams.get('email');
  const router = useRouter();
  const [error, setError] = useState<keyof typeof ErrorMessages | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emailInitialValue) {
      router.replace('/login');
    }
  }, []);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: emailInitialValue ?? '',
      password: '',
    },
  });
  const onSubmit = async (data: LoginSchemaType) => {
    setLoading(true);
    setError(undefined);
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.accessToken) {
        toast.success('Logged in Successfully!');
        localStorage.setItem('token', result.accessToken);
        router.push(`/`);
        return;
      }
      if (result.statusCode === 401) {
        setError(401);
        return;
      }
      setError('default');
    } catch {
      setError('default');
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
          if (error !== undefined) {
            setError(undefined);
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
              <AlertDescription>{ErrorMessages[error]}</AlertDescription>
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
