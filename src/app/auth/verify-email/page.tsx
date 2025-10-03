'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyEmail } from '@/actions/auth';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      const handleVerification = async () => {
        const result = await verifyEmail(token);
        if (result.success) {
          setVerificationStatus('success');
          setMessage(result.message);
        } else {
          setVerificationStatus('error');
          setMessage(result.errors?._server?.[0] || "Ocorreu um erro ao verificar seu email.");
        }
      };
      handleVerification();
    } else {
      setVerificationStatus('error');
      setMessage("Token de verificação não encontrado na URL.");
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Verificação de Email</h2>
        {verificationStatus === 'loading' && (
          <p className="text-center text-gray-700">Verificando seu email...</p>
        )}
        {verificationStatus === 'success' && (
          <p className="text-center text-green-600">{message}</p>
        )}
        {verificationStatus === 'error' && (
          <p className="text-center text-red-600">{message}</p>
        )}
        <p className="text-center text-sm text-gray-600">
          <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
            Ir para a página de login
          </Link>
        </p>
      </div>
    </div>
  );
}