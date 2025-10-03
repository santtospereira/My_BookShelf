import Link from 'next/link';

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Verifique seu Email</h2>
        <p className="text-center text-gray-600">
          Enviamos um link de verificação para o seu endereço de email. Por favor, verifique sua caixa de entrada (e a pasta de spam) para continuar.
        </p>
        <p className="text-center text-sm text-gray-600">
          <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
}