import logger from "pino";
import dayjs from "dayjs";

export function createLogger(fileName: string) {
  return logger({
    transport: {
      target: "pino/file",
      options: {
        destination: process.cwd() + `/logs/${fileName}.log`,
        mkdir: true,
      },
    },
    base: {
      pid: false,
    },
    timestamp: () => `,"time":"${dayjs().format("DD/MM/YYYY HH:mm:ss")}"`,
  });
}

const log = logger({
  transport: {
    target: "pino-pretty",
  },
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format("DD/MM/YYYY HH:mm:ss")}"`,
});

export default log;
