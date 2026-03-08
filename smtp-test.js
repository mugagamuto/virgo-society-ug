import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp.titan.email",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.TITAN_SMTP_USER,
    pass: process.env.TITAN_SMTP_PASS,
  },
  logger: true,
  debug: true,
});

async function run() {
  console.log("USER:", process.env.TITAN_SMTP_USER);
  console.log("PORT:", 587);

  await transport.verify();

  const info = await transport.sendMail({
    from: `Virgo Building Society <${process.env.TITAN_SMTP_USER}>`,
    to: process.env.TEST_TO || "yourgmail@gmail.com",
    subject: "Virgo SMTP test",
    text: "Hello — SMTP login worked.",
  });

  console.log("✅ Sent:", info.messageId);
}

run().catch((e) => {
  console.error("❌ FAIL:", e?.message || e);
  process.exit(1);
});
