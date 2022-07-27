"use strict";

const {
  Logger
} = require('l0g'); 
const {Color} = require('l0g/formatters/Color');
const {
  ConsoleTransport,
} = require('l0g/transports/ConsoleTransport'); 
const {FileTransport}= require('l0g/transports/FileTransport');
const {ReloadConfigFeature}= require('l0g/features/ReloadConfigFeature');

const { isSpoo, isSpooMongoDb, formatSpoo, formatSpooMDB, hasLogCfg, formatLogCfg } = require('./format');

const {name: packageName} = require('../../package.json')

const features = []; 

/** The logger can watch the .env file to reload environment variables
 * This allows you to change the LOG_LEVEL SCOPE or FILTER during a debug session without restarting the process.
 * Applying a regex to the log levels helps a lot in scenarios where you can't use a debugger and can't restart the process.
 */
if ('true' === process.env.LOG_WATCH) {
    const reloadConfigFeature = new ReloadConfigFeature();
    features.push(reloadConfigFeature);
}

/** 
 * Defines how specific objects are formatted. You can then log the entire object and it will be formatted by the formatter 
 * This allows you to format objects in a way that's quickly recognizable. 
 * If you need additional information during a debug session you can change the output for an object here and don't need to change the log calls. 
*/
const formatMap = new Map([
    [isSpooMongoDb, formatSpooMDB],
    [isSpoo, formatSpoo],
    [hasLogCfg, formatLogCfg],
    ...Color.formatMap
]);

const formatter = new Color((options) => {
    const {ts, level, scope, message} = options;
    return `${ts} ${scope} ${level}: ${message}`
}, {
    formatMap, 
    chalkLevel: 3
});

/** Set the color for the notice level to yellow */
Color.colors.key.level.notice = 'yellow';

/** Define the used transports */
const transports = [
    new ConsoleTransport({
        formatter: formatter
    }) 
    /**Uncomment the line to output a log file*/
    // new FileTransport(`${packageName}.log`, {formatter: new Inspect}),
];

/** Create the base logger instance. With a default LOG_LEVEL of 'debug' if no environment variable is present */
const logger = new Logger('debug', {
  transports,
  features
}).scope(packageName)


/** Export default logger instance */
module.exports = logger; 

Logger.scope = /.*/;