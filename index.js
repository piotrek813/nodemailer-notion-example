import * as dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
import { htmlToText } from "nodemailer-html-to-text";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const { results } = await notion.databases.query({
  database_id: "741941b8-086d-4b45-a404-677f50fe67a3",
});

const quotePage = await notion.pages.retrieve({ page_id: results[0].id });
const quoteText = quotePage.properties.Quote.title[0].text.content;
const quoteAuthor = quotePage.properties.By.rich_text[0].text.content;

const mailContent = `<p><i>${quoteText}</i> -${quoteAuthor}</p>`;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

transporter.use("compile", htmlToText());

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
