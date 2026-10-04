import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { isValidEmail } from '@/lib/validation';
import { Resend } from 'resend';
import crypto from 'crypto';

const resetPasswordEmailHtml = (resetUrl: string) => `
  <div style="margin:0;padding:32px 16px;background:#faf7f2;font-family:Arial,Helvetica,sans-serif;color:#1c1917;">
    <div style="max-width:560px;margin:0 auto;border:1px solid #ede4d5;border-radius:16px;background:#ffffff;padding:40px 32px;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
      <div style="text-align:center;margin-bottom:28px;">
        <h1 style="margin:0;color:#2f4739;font-size:26px;font-weight:700;letter-spacing:-0.5px;">The Green Turtles</h1>
        <p style="margin:4px 0 0;color:#8d6b4f;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Account Security</p>
      </div>

      <div style="font-size:15px;line-height:1.6;color:#374151;">
        <h2 style="font-size:18px;color:#1c1917;margin:0 0 16px;font-weight:600;">Password Reset Request</h2>
        <p style="margin:0 0 16px;">We received a request to reset the password for your Green Turtles account.</p>
        <p style="margin:0 0 24px;">Click the button below to choose a new password. This reset link is valid for <strong>1 hour</strong>.</p>

        <div style="text-align:center;margin:32px 0;">
          <a href="${resetUrl}" style="display:inline-block;background:#2f4739;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:30px;box-shadow:0 2px 6px rgba(47,71,57,0.3);">
            Reset My Password
          </a>
        </div>

        <p style="font-size:13px;color:#6b7280;margin:24px 0 12px;">If the button above does not work, copy and paste this link into your web browser:</p>
        <p style="font-size:12px;word-break:break-all;background:#f7f4ee;padding:10px 14px;border-radius:8px;border:1px solid #ede4d5;color:#2f4739;">
          <a href="${resetUrl}" style="color:#2f4739;text-decoration:underline;">${resetUrl}</a>
        </p>

        <p style="font-size:13px;color:#9ca3af;margin:24px 0 0;">
          If you didn't request this password reset, you can safely ignore this email. Your password will not change.
        </p>
      </div>

      <div style="margin-top:36px;border-top:1px solid #f0ebe1;padding-top:20px;text-align:center;color:#9ca3af;font-size:12px;">
        &copy; 2026 The Green Turtles. All rights reserved.
      </div>
    </div>
  </div>
`;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const { db } = await connectToDatabase();

    const user = await db.collection('users').findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address. Please check your spelling or register.' },
        { status: 404 }
      );
    }

    // Generate token and 1-hour expiration
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: tokenExpires,
        },
      }
    );

    // Determine the base origin for the reset link
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const proto = request.headers.get('x-forwarded-proto') || 'http';
    const origin = request.headers.get('origin') || (host ? `${proto}://${host}` : null) || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${origin}/reset-password?token=${resetToken}`;

    // Send email using Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const emailResult = await resend.emails.send({
      from: 'The Green Turtles <onboarding@resend.dev>',
      to: normalizedEmail,
      subject: 'Reset Your Password - The Green Turtles',
      html: resetPasswordEmailHtml(resetUrl),
    });

    if (emailResult.error) {
      console.error('Resend email error:', emailResult.error);

      // If Resend free tier restriction (can only send to verified account owner email)
      if (emailResult.error.statusCode === 403 || emailResult.error.name === 'validation_error') {
        return NextResponse.json({
          success: true,
          message: 'Password reset link generated. (Note: In Resend test mode, emails can only be delivered to the registered admin account).',
          devResetLink: resetUrl,
        });
      }

      return NextResponse.json(
        { error: emailResult.error.message || 'Failed to send password reset email' },
        { status: 500 }
      );
    }

    console.log(`Password reset email successfully sent to ${normalizedEmail}, id: ${emailResult.data?.id}`);

    return NextResponse.json({
      success: true,
      message: 'Password reset link has been sent to your email. Please check your inbox and spam folder.',
    });
  } catch (error: any) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ error: error.message || 'Server error occurred' }, { status: 500 });
  }
}
