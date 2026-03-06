'use client';

import { useState } from 'react';
import { Button, Input } from '@heroui/react';

export default function DevLoginPage() {
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    if (email !== 'test@gmail.com' || password !== '123456') {
      setError('Invalid credentials. Use test@gmail.com / 123456');
      return;
    }
    form.submit();
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        method="POST"
        action="/api/auth/dev-login"
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border p-8"
      >
        <h1 className="text-xl font-bold">Dev Login</h1>
        <p className="text-sm text-muted-foreground">
          Use test@gmail.com / 123456
        </p>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          defaultValue="test@gmail.com"
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          defaultValue="123456"
          required
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" variant="primary" className="w-full">
          Sign in
        </Button>
      </form>
    </div>
  );
}
