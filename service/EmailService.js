const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

exports.EmailService = class EmailService {
  static init() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    return this;
  }

  static async sendInvoiceEmail(email, subject, message, listBillDetail, next) {
    try {
      this.transporter.use(
        "compile",
        hbs({
          viewEngine: {
            extname: "handlebars",
            layoutsDir: "views/",
            defaultLayout: "index",
          },
          viewPath: "views/",
        })
      );
      return await this.transporter.sendMail({
        from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject,
        text: message,
        template: "index",
        context: {
          items: listBillDetail.map((billDetail) => {
            const jsonReflix = {
              name: billDetail.nameProduct,
              shop: billDetail.nameShop,
              quantity: billDetail.amount,
              price: billDetail.PriceOrigin,
            };
            return jsonReflix;
          }),
        },
      });
    } catch (error) {
      next(error);
    }
  }
};
