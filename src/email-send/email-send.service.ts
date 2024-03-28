import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CustomMessages } from 'src/utils/custom-messages';
import { Response } from 'src/utils/response';
import { StatusCodes } from 'src/utils/status-codes';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "Gmail", 
      auth: {
        user: "msdian0718@gmail.com",
        pass: "wwnr acyp fxzw sogb"
      },
    });
  }

  async sendEmail(from:string, to: [], subject: string, text: string) {
    try {

      const response = await this.transporter.sendMail({
        from: from,
        to,
        subject,
        text,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      return new Response(false, StatusCodes.BAD_REQUEST, CustomMessages.BAD_REQUEST, {});

    }
  }

  async sendEmailWithTemplate(from:string, to: string, subject: string, template: any,data:Object) {
    try {
      
      const response = await this.transporter.sendMail({
        from: from,
        to,
        subject,
        html:template,
        // context: data
      });
      console.log('Email sent successfully');
      return new Response(true, StatusCodes.OK, CustomMessages.SUCCESS, {});

    } catch (error) {
      console.error('Error sending email:', error);
      return new Response(false, StatusCodes.BAD_REQUEST, CustomMessages.BAD_REQUEST, {});

    }
  }

  async sendEmailWithEvent(sendto, subject, htmlbody, calendarObj) {
    let mailOptions = {
        to: sendto,
        subject: subject,
        html: htmlbody
    }
    if (calendarObj) {
        let alternatives = {
          "Content-Type": "text/calendar",
          "method": "REQUEST",
          "content": new Buffer(calendarObj.toString()),
          "component": "VEVENT",
          "Content-Class": "urn:content-classes:calendarmessage"
        }
        mailOptions['alternatives'] = alternatives;
        mailOptions['alternatives']['contentType'] = 'text/calendar'
        mailOptions['alternatives']['content'] = new Buffer(calendarObj.toString())
    }
    
      this.transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " , response);
        }
    })
}
}
