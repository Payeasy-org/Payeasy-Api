"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.getTransporter = void 0;
const nodemailer_1 = require("nodemailer");
const nodemailer_sendgrid_1 = __importDefault(require("nodemailer-sendgrid"));
const core_1 = require("@/core");
const getTransporter = () => {
    const options = {
        apiKey: core_1.config.sendGrid.sendGridApikey,
    };
    return (0, nodemailer_1.createTransport)((0, nodemailer_sendgrid_1.default)(options));
};
exports.getTransporter = getTransporter;
const sendEmail = async (emailDto) => {
    const { to, subject, body } = emailDto;
    const from = core_1.config.sendGrid.sendgrid_email;
    const transporter = (0, exports.getTransporter)();
    const mailOptions = {
        from,
        to,
        subject,
        html: body,
    };
    await transporter.sendMail(mailOptions);
    core_1.logger.info(`Mail sent Successfully to ${to}`);
    return emailDto;
};
exports.sendEmail = sendEmail;
