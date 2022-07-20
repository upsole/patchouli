import pino from "pino";

const transport = pino.transport({
  targets: [
    {
      level: "info",
      target: "pino-pretty",
      options: {
        translateTime: "SYS:HH:MM:ss dd-mm-yyyy ",
        ignore: "object",
      },
    },
    {
      level: "debug",
      target: "pino/file",
      options: {
        translateTime: "SYS:HH:MM:ss dd-mm-yyyy ",
        ignore: "",
        destination: "logs/main",
      },
    },
  ],
});

export const logger = pino(transport);
