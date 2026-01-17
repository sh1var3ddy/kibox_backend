import winston from "winston";

const isProd = process.env.NODE_ENV === "production";
const isVercel = !!process.env.VERCEL; // set automatically on Vercel

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
];

// Only write to disk when NOT on Vercel
if (!isVercel && !isProd) {
  transports.push(
    new winston.transports.File({ filename: "logs/app.log" })
  );
}

export const logger = winston.createLogger({
  level: isProd ? "info" : "debug",
  transports,
});
