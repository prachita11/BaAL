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
        `<h3> Thanks for registering to BaAL developers guide </h3>
        <p> Hi ` +
        email +
        ` Here are the details for you to access the Developer's API kit. You can also visit <a href="https://baal-in.netlify.app/api">https://baal-in.netlify.app/api </a> for detailed documentation
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

async function subscription(email, plan, price, limit) {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
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
      subject: "BaAL Subscription Successfull!", // Subject line
      html:
        `<h3> You have successfully subscribed to the yearly plans of BaAL Developers Portal</h3>
        <p> Hi ` +
        email +
        ` Here are the details of your API kit availed through this subscription
        <br> 
       <table>
       <tr>
       <th style="border:solid black 2px">
       Plan
       </th>
       <th style="border:solid black 2px">
       Available API hit Limit
       </th>
       <th style="border:solid black 2px">
       Price
       </th>
       </tr>
       <tr>
       <td style="border:solid black 2px"> ${plan}</td>
       <td style="text-align:center;border:solid black 2px">${limit}</td>
       <td style="border:solid black 2px">${price}</td>
       </tr>

       </table>
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

async function reset(email, pass) {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
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
      subject: "Reset Password Link", // Subject line
      html:
        `
        <p> Hi ` +
        email +
        `  , <br>Here is your reset password to log in to your account
        <br> 
        <h4> Password : ${pass} </h4>
        <h4> Click <a href="http://localhost:3000/dev/login"> here </a> to log in to your account </h4>
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
module.exports = { main, subscription, reset };
