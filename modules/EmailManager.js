//---------------------------------------------------
// EMAIL MANAGER MODULE
//---------------------------------------------------
import nodemailer from "nodemailer";

// Configure transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "alejandro.perez.acosta@gmail.com",
    pass: "bzjz fsev xwoh dgkt",
  },
});

// Function to send email with dynamic options
export function sendDynamicEmail(to, subject, text, html) {
  const mailOptions = {
    from: "alejandro.perez.acosta@gmail.com",
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
}