'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useTransitionRouter } from 'next-view-transitions';
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
import { AlertTitle, AlertDescription, Alert } from '@/components/ui/alert';
import { toast } from 'sonner';
import { PasswordInput } from '@/components/ui/password-input';
import { useState } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { RegisterSchema, type RegisterSchemaType } from '@repo/api';

const ErrorMessages = {
  default: 'Error Happened while registering. try again later.',
  409: (
    <p>
      Email already exists. if it's yours{' '}
      <Link href={'/login'} className={'underline underline-offset-4'}>
        Login
      </Link>
    </p>
  ),
} as const;

export default function RegisterForm() {
  const [error, setError] = useState<keyof typeof ErrorMessages | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const router = useTransitionRouter();
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    setLoading(true);
    setError(undefined);
    try {
      const response = await fetch('http://localhost:3000/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.statusCode === 409) {
        setError(409);
        form.setValue('password', '');
        setLoading(false);
        return;
      }
      toast.success('Signed Up Successfully!');
      router.push(`/login?email=${result?.email}`);
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
            <h1 className="text-2xl font-bold">Create An Account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Enter your credentials below to register
            </p>
          </div>
          {error ? (
            <Alert variant="destructive" className={'mt-2'}>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{ErrorMessages[error]}</AlertDescription>
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
                  setError(undefined);
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
