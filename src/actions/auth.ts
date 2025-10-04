'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email'; // Importar sendEmail
import { redirect } from 'next/navigation'; // Importar redirect

// Define a schema for registration input
const registerSchema = z.object({
  name: z.string().min(1, "O nome completo é obrigatório."),
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

export async function registerUser(formData: FormData) {
  const fullName = formData.get('fullName');
  const email = formData.get('email');
  const password = formData.get('password');

  const validationResult = registerSchema.safeParse({ name: fullName, email, password });

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { data } = validationResult;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        success: false,
        errors: { email: ["Este email já está em uso."] },
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'USER',
      },
    });

    const verificationToken = generateToken();
    const expires = new Date(Date.now() + 24 * 3600 * 1000);

    await prisma.emailVerificationToken.create({
      data: {
        token: verificationToken,
        expires,
        userId: newUser.id,
      },
    });

    const verificationLink = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;
    await sendEmail({
      to: newUser.email,
      subject: 'Verifique seu Email',
      html: `<p>Clique <a href="${verificationLink}">aqui</a> para verificar seu email.</p>`,
      text: `Para verificar seu email, acesse: ${verificationLink}`,
    });

  } catch (error) {
    // Adicionar verificação para não tratar o erro de redirect como um erro de registro
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }
    console.error("Error registering user:", error);
    return {
      success: false,
      errors: { _server: ["Não foi possível registrar o usuário. Tente novamente."] },
    };
  }

  // Redirecionar após o sucesso de todas as operações no bloco try
  redirect('/auth/check-email');
}

// Function to generate a random token
function generateToken() {
  return crypto.randomBytes(32).toString('hex'); // 64 characters long
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get('email') as string;

  const emailSchema = z.string().email("Email inválido.");
  const validationResult = emailSchema.safeParse(email);

  if (!validationResult.success) {
    return {
      success: false,
      errors: { email: ["Por favor, forneça um email válido."] },
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: validationResult.data },
    });

    if (!user) {
      // For security, don't reveal if the email exists or not
      return {
        success: true, // Pretend it worked to avoid user enumeration
        message: "Se o email estiver registrado, você receberá um link para redefinir sua senha.",
      };
    }

    // Generate a new token
    const token = generateToken();
    const expires = new Date(Date.now() + 3600 * 1000); // Token valid for 1 hour

    // Delete any existing tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Save the new token
    await prisma.passwordResetToken.create({
      data: {
        token,
        expires,
        userId: user.id,
      },
    });

    // --- Send email ---
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Redefinição de Senha',
      html: `<p>Clique <a href="${resetLink}">aqui</a> para redefinir sua senha.</p>`,
      text: `Para redefinir sua senha, acesse: ${resetLink}`,
    });
    // --- End Send email ---

    return {
      success: true,
      message: "Se o email estiver registrado, você receberá um link para redefinir sua senha.",
    };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return {
      success: false,
      errors: { _server: ["Não foi possível solicitar a redefinição de senha. Tente novamente."] },
    };
  }
}

export async function resetPassword(formData: FormData) {
  const token = formData.get('token') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const passwordSchema = z.string().min(6, "A senha deve ter no mínimo 6 caracteres.");
  const validationResult = passwordSchema.safeParse(password);

  if (!validationResult.success) {
    return {
      success: false,
      errors: { password: validationResult.error.flatten().fieldErrors.password },
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      errors: { confirmPassword: ["As senhas não coincidem."] },
    };
  }

  try {
    // Find and validate the token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return {
        success: false,
        errors: { _server: ["Token de redefinição inválido ou expirado."] },
      };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Invalidate/delete the token
    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return {
      success: true,
      message: "Sua senha foi redefinida com sucesso!",
    };
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      success: false,
      errors: { _server: ["Não foi possível redefinir sua senha. Tente novamente."] },
    };
  }
}

export async function verifyEmail(token: string) {
  try {
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return {
        success: false,
        errors: { _server: ["Token de verificação inválido ou expirado."] },
      };
    }

    // Update user's emailVerified status
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date() },
    });

    // Invalidate/delete the token
    await prisma.emailVerificationToken.delete({
      where: { token },
    });

    return {
      success: true,
      message: "Seu email foi verificado com sucesso!",
    };
  } catch (error) {
    console.error("Error verifying email:", error);
    return {
      success: false,
      errors: { _server: ["Não foi possível verificar seu email. Tente novamente."] },
    };
  }
}
