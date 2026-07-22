'use client';

import React, { useState } from 'react';
import { Button, Input } from 'react-aria-components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
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

    // Validação básica
    if (!username || !password) {
      setError('Todos os campos são obrigatórios');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar');
      }

      // Cadastro bem-sucedido – redireciona para login
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap flex-col items-center justify-center overflow-hidden gap-4 mt-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1>Cadastre-se</h1>

        <Input
          name="username"
          placeholder="Nome de usuário"
          className="bg-utility-emerald-500 text-white user-input"
        />
       
        <Input
          name="password"
          type="password"
          placeholder="Senha"
          className="bg-utility-emerald-500 text-white password-input"
        />

        {error && <p className="text-red-500">{error}</p>}

        <Button
          className="bg-utility-emerald-500 text-white mt-10"
          type="submit"
          
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>

        <Link
          className="bg-utility-emerald-500 text-white mt-10 text-center"
          href="/login"
        >
          Já possui uma conta? Faça login
        </Link>
      </form>
    </div>
  );
}
