'use strict';

import { Logger } from 'l0g';
import { Color, Formatter } from 'l0g/formatters/Color';
import { ConsoleTransport } from 'l0g/transports/ConsoleTransport';
import { FileTransport } from 'l0g/transports/FileTransport';
import { ReloadConfigFeature } from 'l0g/features/ReloadConfigFeature';
import { hasLogCfg, formatLogCfg } from './format';

const { name: packageName } = require('../../package.json');

const features = [];

/** The logger can watch the .env file to reload environment variables
 * This allows you to change the LOG_LEVEL SCOPE or FILTER during a debug session without restarting the process.
 * Applying a regex to the log levels helps a lot in scenarios where you can't use a debugger and can't restart the process.
 */
if (process.env.LOG_WATCH === 'true') {
    const reloadConfigFeature = new ReloadConfigFeature();
    features.push(reloadConfigFeature);
}

/**
 * Defines how specific objects are formatted. You can then log the entire object and it will be formatted by the formatter
 * This allows you to format objects in a way that's quickly recognizable.
 * If you need additional information during a debug session you can change the output for an object here and don't need to change the log calls.
 */
const formatMap = new Map([[hasLogCfg, formatLogCfg], ...Color.formatMap]);

const formatter = new Color(
    (options) => {
        const { ts, level, scope, message } = options;
        return `${ts} ${scope} ${level}: ${message}`;
    },
    {
        formatMap,
        chalkLevel: 3,
    }
);

/** Set the color for the notice level to yellow */
Color.colors.key.level.notice = 'yellow';

/** Define the used transports */
const transports = [
    new ConsoleTransport({
        formatter,
    }),
    /** Uncomment the line to output a log file */
    // new FileTransport(`${packageName}.log`, { formatter: Formatter }),
];

/** Create the base logger instance. With a default LOG_LEVEL of 'debug' if no environment variable is present */
const logger = new Logger('debug', {
    transports,
    features,
}).scope(packageName);

Logger.scope = /.*/;

/** Export default logger instance */
export default logger;
