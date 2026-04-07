import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

try {
	await transporter.verify();
	console.log('Server is ready to take our messages');
} catch (err) {
	console.error('Verification failed:', err);
}

export async function sendVerificationMail(email, token) {
	try {
		const info = await transporter.sendMail({
			from: `'NitpickSupport' <${process.env.SMTP_USER}>`,
			to: `${email}`,
			subject: 'Account Activation - Nitpick',
			text: `http://localhost:5173/verify-email?token=${token}`,
		});

		console.log(info);
	} catch (error) {
		console.error(`Error in sendVerificationMail: ${error.message}`);
		throw new Error(error.message);
	}
}

export default transporter;
