'use client';

import React, { useState } from 'react';
import { Button, Input } from 'react-aria-components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      setError('Preencha todos os campos');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha no login');
      }

      // Login bem-sucedido – redireciona para página protegida (ex.: dashboard)
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1>Login</h1>
        <Input
          name="username"
          type="username"
          placeholder="Nome de usuário: "
          className="bg-utility-emerald-500 text-white"
        />
        <Input
          name="password"
          type="password"
          placeholder="Senha"
          className="bg-utility-emerald-500 text-white"
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" className="bg-utility-emerald-500 text-white">
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
        <Link href="/signin" className="bg-utility-emerald-500 text-white text-center">
          Ainda não tem conta? Cadastre-se
        </Link>
      </form>
    </div>
  );
}
