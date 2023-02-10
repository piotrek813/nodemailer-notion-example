import * as dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
// this is a plugin for nodemailer that allows us to auto generate *text* from *html* when we send email with nodemailer.
import { htmlToText } from "nodemailer-html-to-text";
import { Client } from "@notionhq/client";

// configure notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// fetch pages from quote database
// since node.js version v14.8 we can use top level await in ES Modules
// https://www.stefanjudis.com/today-i-learned/top-level-await-is-available-in-node-js-modules/
// I set the type in package.json to module and I believe you did too.
const { results } = await notion.databases.query({
  database_id: "741941b8-086d-4b45-a404-677f50fe67a3",
});

// assign one page from results of previous query to quotePage varibale. I do it purely for readability.
const quotePage = await notion.pages.retrieve({ page_id: results[0].id });
// then we get data that interest us from page properties.
// -- quoteText is quote itself
const quoteText = quotePage.properties.Quote.title[0].text.content;
// -- quoteAuthor is an author of said quote
const quoteAuthor = quotePage.properties.By.rich_text[0].text.content;

// We use template literals to create html we'll later send.
//You can read about this syntax here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
const mailContent = `<p><i>${quoteText}</i> -${quoteAuthor}</p>`;

// we create nodemailer transporter this is copy pasted from docs
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// here we're telling transporter we created to use nodemailer-html-to-text
transporter.use("compile", htmlToText());

// and we send mail. I skipped *from* because it's seems nodemailer is filling that in on it's own.
// I also don't pass anything for *text* because we have a plugin to do it for us
transporter
  .sendMail({
    to: "piotreksmolinski04@gmail.com",
    subject: "Quote of the day",
    html: mailContent,
  })
  .then((info) => {
    console.log({ info });
  })
  .catch(console.error);
