'use client';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { get } from '@/lib/api';

export default function Home() {
  const [user, setUser] = useState<
    | undefined
    | {
        name: string;
      }
  >(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token && typeof token === 'string') {
          const result = await get<{ name: string }>('auth/me', {
            headers: {
              authorization: `Bearer ${token}`,
            },
          });
          setUser(result);
        }
      } catch {
        setUser(undefined);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start justify-center md:shadow-xl md:rounded-3xl md:p-10">
        <Image
          src="/easy-gen.svg"
          alt="Easy Generator logo"
          width={400}
          height={38}
          priority
        />
        <h2 className={'text-center w-full text-xl md:text-2xl'}>
          {`Welcome to the application${user ? ', ' + user.name : ''}.`}
        </h2>
        {loading ? (
          <div className={'w-full flex items-center justify-center min-w-52'}>
            <LoadingSpinner loading={loading} />
          </div>
        ) : user ? (
          <Button
            variant={'secondary'}
            size={'xl'}
            className={'w-full rounded-full'}
            onClick={() => {
              setUser(undefined);
              localStorage.removeItem('token');
            }}
          >
            Logout
          </Button>
        ) : (
          <div className="flex gap-4 items-center justify-center flex-col sm:flex-row w-full">
            <Button asChild variant={'default'} size={'xl'} className={'w-40'}>
              <Link href={'/login'}>Login</Link>
            </Button>
            <Button asChild variant={'outline'} size={'xl'} className={'w-40'}>
              <Link href={'/register'}>Register</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
