const nodemailer = require("nodemailer");

function sendMailToEmployee(userMail, password) {
  const adminMailId = process.env.NODEMAILER_MAIL_ID;
  const adminPassword = process.env.NODEMAILER_PASSWORD;

  return new Promise(async (resolve, reject) => {
    const transporter = new nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: adminMailId,
        pass: adminPassword,
      },
    });

    let mailOptions = {
      from: `Siva Infosystems <${adminMailId}>`,
      to: userMail,
      subject: `Account created successfully`,
      html: `
        <h2>Hope this mail finds you well, 
        This is to inform you that your account with this email has been created successfully.</h2><br>
        <h3>Here is your password :  ${password} </h3> <br> 
        <a href = "https://www.sivainfosystem.in/employee/login">Click here to login</a>
        `,
    };

    await transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log("err", err);
        reject(true);
      } else {
        console.log("info", info);
        resolve(true);
      }
    });
  });
}

function sendMailToEmployer(userDetails) {
    const adminMailId = process.env.NODEMAILER_MAIL_ID;
    const adminPassword = process.env.NODEMAILER_PASSWORD;

    const employerMail = process.env.NODEMAILER_EMPLOYER_MAIL;

    const {name, email, phoneNumber, _id, position, salary, experience, password} = userDetails;
  
    return new Promise(async (resolve, reject) => {
      const transporter = new nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: adminMailId,
          pass: adminPassword,
        },
      });
  
      let mailOptions = {
        from: `Siva Infosystems <${adminMailId}>`,
        to: employerMail,
        subject: `Employee account created successfully`,
        html: `
          <h2>Hey there !!!, 
         An employee account with the follwing details, has been created successfully.</h2><br>
          <h3>
          ID :  ${_id}
          Name :  ${name}
          Email :  ${email}
          Phone number :  ${phoneNumber}
          Position :  ${position}
          Experience :  ${experience}
          Salary :  ${salary}
          Password : ${password}
          </h3> <br>
          `,
      };
  
      await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log("err", err);
          reject(true);
        } else {
          console.log("info", info);
          resolve(true);
        }
      });
    });
  }

module.exports = {sendMailToEmployee, sendMailToEmployer};
