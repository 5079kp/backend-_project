import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // Validate required environment variables
  if (!process.env.EMAIL_USER) {
    throw new Error("EMAIL_USER is not defined in environment variables");
  }
  
  if (!process.env.EMAIL_PASS) {
    throw new Error("EMAIL_PASS is not defined in environment variables");
  }
  
  // Validate options
  if (!options || !options.email || !options.subject || !options.message) {
    throw new Error("Missing required email options: email, subject, and message are required");
  }

  // Configure transporter based on environment
  let transporterConfig;
  
  if (process.env.EMAIL_SERVICE) {
    // Use service configuration (Gmail, Outlook, etc.)
    transporterConfig = {
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
  } else if (process.env.EMAIL_HOST) {
    // Use custom SMTP configuration
    transporterConfig = {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
  } else {
    throw new Error("Email configuration missing: Either EMAIL_SERVICE or EMAIL_HOST must be defined");
  }

  const transporter = nodemailer.createTransport(transporterConfig);

  // Verify connection configuration
  try {
    await transporter.verify();
  } catch (error) {
    throw new Error(`Email configuration error: ${error.message}`);
  }

  // Optional: Add HTML support
  const message = {
    from: `${process.env.FROM_NAME || "EcoShop"} <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message.replace(/\n/g, "<br>")}</p>`, // Convert plain text to HTML
  };

  try {
    const info = await transporter.sendMail(message);
    
    if (process.env.NODE_ENV !== "production") {
      console.log(`Message sent: ${info.messageId}`);
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return info;
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default sendEmail;