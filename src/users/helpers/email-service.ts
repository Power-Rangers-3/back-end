// import nodemailer  from 'nodemailer';
import * as nodemailer from 'nodemailer';

export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly baseUrl: string;

  constructor(baseUrl: string, emailConfig: nodemailer.SentMessageInfo) {
    // console.log(emailConfig);
    this.transporter = nodemailer.createTransport(emailConfig);
    this.baseUrl = baseUrl;
  }

  async sendPasswordResetEmail(email: string, code: string) {
    const resetLink = `${this.baseUrl}/reset-password?email=${email}&code=${code}`;
    const mailOptions: nodemailer.SendMail.Options = {
      from: process.env.SMTP_USER, // 'power.rangers.backend@gmail.com',
      to: email,
      subject: 'Password reset request',
      html: `
        <h1>Hello,</h1>
          <p>We received a request to reset your password. To proceed, please click the following link:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>If you did not request this password reset, please ignore this email.</p>
          <h2>Your password reset code is: <strong>${code}</strong></h2>
      `,
    };
    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);

    } catch (err) {
      console.error(`Error sending password reset email to ${email}:`, err);
      throw new Error('Unable to send password reset email');
    }
  }
}
