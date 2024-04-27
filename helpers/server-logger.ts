import { createLogger, format, transports } from "winston";

const { combine, timestamp, prettyPrint, colorize, simple } = format;

const customLevels = {
	levels: {
		info: 0,
		error: 1,
		warning: 2,
	},
	colors: {
		info: "green",
		error: "yellow",
		warning: "red",
	},
};

const serverLogger = createLogger({
	format: combine(timestamp(), prettyPrint(), colorize(), simple()),
	levels: customLevels.levels,
	transports: [
		new transports.Console({}),
		new transports.File({ filename: "server-log.log" }),
	],
});

export { serverLogger };
