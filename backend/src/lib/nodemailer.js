import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { BrevoClient, BrevoEnvironment } = require('@getbrevo/brevo');

const client = new BrevoClient({
	apiKey: process.env.BREVO_API_KEY,
	environment: BrevoEnvironment.Production,
});

export async function sendVerificationMail(email, token) {
	const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

	const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a2e;padding:32px;text-align:center;">
             <img src="${process.env.FRONTEND_URL}/assets/logo_mail.png" alt="Nitpick" width="95px" height="28px" style="display: block; margin: 0 auto;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <h2 style="margin:0 0 12px;font-size:18px;font-weight:500;color:#0f0f0f;">Verify your email address</h2>
              <p style="margin:0 0 12px;font-size:15px;color:#6b7280;line-height:1.7;">Thanks for signing up for Nitpick! You're one step away from accessing your account.</p>
              <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.7;">Click the button below to confirm your email address and activate your account.</p>

              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <a href="${verificationUrl}"
                       style="display:inline-block;background:#1a1a2e;color:#ffffff;text-decoration:none;font-size:15px;font-weight:500;padding:14px 36px;border-radius:8px;">
                      Activate my account
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f9f9fb;border-radius:8px;padding:16px 20px;">
                    <p style="margin:0 0 6px;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Or copy this link</p>
                    <p style="margin:0;font-size:12px;color:#6b7280;word-break:break-all;font-family:monospace;">${verificationUrl}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;line-height:1.6;">
                Didn't create a Nitpick account? You can safely ignore this email. This link expires in <strong style="color:#6b7280;">24 hours</strong>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #f0f0f0;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">© 2026 Nitpick</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

	try {
		await client.transactionalEmails.sendTransacEmail({
			sender: { name: 'Nitpick', email: process.env.SMTP_USER },
			to: [{ email }],
			subject: 'Activate your account - Nitpick',
			textContent: `Activate your Nitpick account here: ${verificationUrl}`,
			htmlContent: html,
		});
	} catch (error) {
		console.error(`Error in sendVerificationMail: ${error.message}`);
		throw new Error(error.message);
	}
}

export async function sendPasswordResetMail(email, token) {
	const passwordResetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

	const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a2e;padding:32px;text-align:center;">
             <img src="${process.env.FRONTEND_URL}/assets/logo_mail.png" alt="Nitpick" width="95px" height="28px" style="display: block; margin: 0 auto;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <h2 style="margin:0 0 12px;font-size:18px;font-weight:500;color:#0f0f0f;">Reset your password</h2>
              <p style="margin:0 0 12px;font-size:15px;color:#6b7280;line-height:1.7;">You're one step away from resseting your password.</p>
              <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.7;">Click the button below to enter your new password.</p>

              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <a href="${passwordResetUrl}"
                       style="display:inline-block;background:#1a1a2e;color:#ffffff;text-decoration:none;font-size:15px;font-weight:500;padding:14px 36px;border-radius:8px;">
                      Reset password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f9f9fb;border-radius:8px;padding:16px 20px;">
                    <p style="margin:0 0 6px;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Or copy this link</p>
                    <p style="margin:0;font-size:12px;color:#6b7280;word-break:break-all;font-family:monospace;">${passwordResetUrl}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;line-height:1.6;">
                Didn't request a password reset? You can safely ignore this email. This link expires in <strong style="color:#6b7280;">1 hour</strong>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #f0f0f0;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">© 2026 Nitpick</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

	try {
		await client.transactionalEmails.sendTransacEmail({
			sender: { name: 'Nitpick', email: process.env.SMTP_USER },
			to: [{ email }],
			subject: 'Password reset - Nitpick',
			textContent: `Reset your Nitpick password here: ${passwordResetUrl}`,
			htmlContent: html,
		});
	} catch (error) {
		console.error(`Error in sendPasswordResetMail: ${error.message}`);
		throw new Error(error.message);
	}
}
