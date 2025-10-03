'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@/actions/auth';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[] | undefined> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      setLoading(false);
    } else {
      setErrors({ _server: ["Token de redefinição não encontrado na URL."] });
      setLoading(false);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrors(null);

    if (!token) {
      setErrors({ _server: ["Token de redefinição ausente."] });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: ["As senhas não coincidem."] });
      return;
    }

    const formData = new FormData();
    formData.append('token', token);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);

    const result = await resetPassword(formData);

    if (!result.success) {
      setErrors(result.errors || { _server: ["Ocorreu um erro desconhecido."] });
    } else {
      setMessage(result.message);
      // Redirect to login page after successful password reset
      router.push('/auth/signin');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-700">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Redefinir Senha</h2>
        {message && <p className="text-green-500 text-center">{message}</p>}
        {errors?._server && <p className="text-red-500 text-center">{errors._server[0]}</p>}
        {token ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Nova Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors?.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Nova Senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors?.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword[0]}</p>}
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Redefinir Senha
            </button>
          </form>
        ) : (
          <p className="text-red-500 text-center">Token de redefinição inválido ou ausente.</p>
        )}
        <p className="text-center text-sm text-gray-600">
          <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
}
