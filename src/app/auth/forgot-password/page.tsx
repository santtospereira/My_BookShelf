'use client';

import { useState } from 'react';
import { requestPasswordReset } from '@/actions/auth';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[] | undefined> | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrors(null);

    const formData = new FormData();
    formData.append('email', email);

    const result = await requestPasswordReset(formData);

    if (!result.success) {
      setErrors(result.errors || { _server: ["Ocorreu um erro desconhecido."] });
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Esqueceu sua senha?</h2>
        <p className="text-center text-gray-600">
          Digite seu email abaixo e enviaremos um link para redefinir sua senha.
        </p>
        {message && <p className="text-green-500 text-center">{message}</p>}
        {errors?._server && <p className="text-red-500 text-center">{errors._server[0]}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors?.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Enviar link de redefinição
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
}
