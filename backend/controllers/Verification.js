const transporter = require('../utils/transport');


async function otpsend(email, otp, req, res) {
  console.log(email, otp);

  try {
    const info = await transporter.sendMail({
      from: '"Pack-Me.official" <md.packme.official@gmail.com>',
      to: email,
      subject: "Your Pack-ME Verification Code",
      html: `
            <p>Dear user,</p>

            <p>Welcome to <strong>Pack-ME</strong>!</p>

            <p>Your One-Time Password (OTP) for verification is:</p>

            <h2 style="color:#2b6cb0;">${otp}</h2>

            <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>

            <p>If you didn’t request this, please ignore this email.</p>

            <p>Warm regards,<br>
            <strong>Team Pack-Me</strong></p>
        `
    });

    console.log("Message sent: %s", info.messageId);
    res.json({success:true,otp:otp ,message:"otop sent"})

     // ✅ redirect to GET route that renders the page
  } catch (error) {
    console.error(error);
    
  }
}

module.exports = otpsend;
