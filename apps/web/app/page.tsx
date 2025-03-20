import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { Button } from '@/components/ui/button';
import { loggedIn } from '@/lib/constants';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start justify-center md:shadow-xl md:rounded-3xl md:p-10">
        <Image
          src="/easy-gen.svg"
          alt="Next.js logo"
          width={400}
          height={38}
          priority
        />
        <h2 className={'text-center w-full text-xl md:text-2xl'}>
          Welcome to the application.
        </h2>
        {loggedIn ? (
          <Button
            variant={'secondary'}
            size={'xl'}
            className={'w-full rounded-full'}
          >
            Logout
          </Button>
        ) : (
          <div className="flex gap-4 items-center justify-center flex-col sm:flex-row w-full">
            <Button
              asChild
              variant={'default'}
              size={'xl'}
              className={'w-24 rounded-full'}
            >
              <Link href={'/login'}>Login</Link>
            </Button>
            <Button
              asChild
              variant={'outline'}
              size={'xl'}
              className={'w-24 rounded-full'}
            >
              <Link href={'/register'}>Register</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
