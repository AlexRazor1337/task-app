const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.mail_from,
        subject: "Welcome to the app!",
        text: `${name}, welcome to the app.`
    });
}

module.exports = {
    sendWelcomeMail
}