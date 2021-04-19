"use strict";
require("dotenv").config();
const nodemailer = require("nodemailer");

async function main(email, access) {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      // port: use your port for your smtp server
      //host: use your host for the smtp server
      //remove service if you have your own smtp server.
      service: "gmail",
      auth: {
        user: process.env.EMAIL, //process.env.EMAIL,
        pass: process.env.PASSWORD, // process.env.PASSWORD,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to: email, // list of receivers
      subject: "BaAL Developer's API Kit", // Subject line
      html:
        `<h3> Thanks for downloading BaAL developers guide </h3>
        <p> Hi ` +
        email +
        ` Here are the details for you to access the Developer's API kit. You can also visit --insert link-- for detailed documentation
        <br> 
        <b> Please donot share the API key</b>
         <h4> API KEY : ${access}</h4>
         <br>
         <br>
         <b> Team BaAL </b>
           `,
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (err) {
    console.log("mail was not sent", err);
    return false;
  }
}

module.exports = { main };
