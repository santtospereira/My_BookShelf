import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  // Ensure environment variables are set
  if (!process.env.EMAIL_SERVER_HOST || !process.env.EMAIL_SERVER_PORT || !process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD || !process.env.EMAIL_FROM) {
    console.error("Missing email server environment variables. Cannot send email.");
    // In a production app, you might throw an error or use a fallback
    return { success: false, message: "Configuração de email incompleta." };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'), // Default to 587 if not set
    secure: process.env.EMAIL_SERVER_PORT === '465', // Use 'true' for 465, 'false' for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    console.log(`Email sent successfully to ${options.to}`);
    return { success: true, message: "Email enviado com sucesso." };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Falha ao enviar email." };
  }
}
