// src/app/auth/error/page.tsx
"use client"; // This is a client component

import { useSearchParams } from "next/navigation";
import React from "react";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "Ocorreu um erro desconhecido durante a autenticação.";

  switch (error) {
    case "OAuthAccountNotLinked":
      errorMessage = "Esta conta já está vinculada a outro usuário.";
      break;
    case "EmailSignInError":
      errorMessage = "Não foi possível fazer login com o e-mail fornecido.";
      break;
    case "CredentialsSignin":
      errorMessage = "Credenciais inválidas. Verifique seu e-mail e senha.";
      break;
    // Adicione mais casos conforme necessário para outros erros do NextAuth
    default:
      if (error) {
        errorMessage = `Erro: ${error}. Por favor, tente novamente.`;
      }
      break;
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Erro de Autenticação</h1>
      <p>{errorMessage}</p>
      <p>
        <a href="/auth/signin">Voltar para o Login</a>
      </p>
    </div>
  );
}