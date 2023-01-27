require("dotenv").config();
const { transporter } = require("./utils/transporter");
const mjml2html = require("mjml");

const { html } = mjml2html(`
<mjml>
    <mj-body>
    <mj-section background-color="#fafafa">
    <mj-column width="400px">

      <mj-text font-style="italic"
               font-size="20px"
               font-family="Helvetica Neue"
               color="#626262">My Awesome Text</mj-text>

        <mj-text color="#525252">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin rutrum enim eget magna efficitur, eu semper augue semper. Aliquam erat volutpat. Cras id dui lectus. Vestibulum sed finibus lectus, sit amet suscipit nibh. Proin nec commodo purus. Sed eget nulla elit. Nulla aliquet mollis faucibus.
      </mj-text>

        <mj-button background-color="#F45E43"
                 href="#">Learn more</mj-button>

    </mj-column>
    </mj-section>
    </mjml>
    </mj-body>
`);

transporter
  .sendMail({
    from: "Ноде Майлер <foobar@example.com>", // sender address
    to: "piotreksmolinski04@gmail.com", // list of receivers
    subject: "New exiting news from me", // Subject line
    // text: "There is a new article. It's about sending emails, check it out!", // plain text body
    html: html,
  })
  .then((info) => {
    console.log({ info });
  })
  .catch(console.error);
