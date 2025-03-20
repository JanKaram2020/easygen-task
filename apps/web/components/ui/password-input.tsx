'use client';
import { useState } from 'react';
import { Input } from './input';
import * as React from 'react';
import { EyeOff, Eye } from 'lucide-react';

const PasswordInput = ({
  ...props
}: Omit<React.ComponentProps<'input'>, 'type'>) => {
  const [isView, setIsView] = useState(false);
  return (
    <div className="relative">
      <Input type={isView ? 'text' : 'password'} {...props} />
      {isView ? (
        <Eye
          size={'20'}
          className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
          onClick={() => {
            setIsView((p) => !p);
          }}
        />
      ) : (
        <EyeOff
          size={'20'}
          className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
          onClick={() => setIsView((p) => !p)}
        />
      )}
    </div>
  );
};
export { PasswordInput };
