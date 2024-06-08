const nodemailer = require('nodemailer');
const pug = require('pug');
const {convert} = require('html-to-text');

module.exports = class Email {
  constructor(user, url){
    this.to = user.email
    this.firstName = user.name.split(' ')[0]
    this.url = url
    this.from = `Alexander Tonkov <${process.env.EMAIL_FROM}>`;

  }

  newTransport() {
    if(process.env.NODE_ENV === 'production') {
      //Sendgrid

      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASS
        }
      })
    }

    return nodemailer.createTransport({
      //service: 'Gmail',
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASS,
      }
  })
}

async send(template, subject) {
//Send the actual email

// 1) Render HTML based on a pug template
const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
  firstName: this.firstName,
  url: this.url,
  subject
})
// 2) Define email options
const mailOptions = {
  from: this.from,
  to: this.to,
  subject,
  html,
  text:convert(html)
}
  // 3) Create transport and send email
this.newTransport()
await this.newTransport().sendMail(mailOptions)
}

async sendWelcome() {
 await this.send('welcome', 'Welcome to the Natours Family!')
}

async sendPasswordReset(){
  await this.send('passwordReset', 'Your password reset token (valid for 10 min)' )
}

}