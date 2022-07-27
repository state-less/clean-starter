const statusColors = {
    200: 'green',
    300: 'blue',
    400: 'orange',
    500: 'red'
  };
  const timingColors = {
    0: 'green',
    200: 'yellow',
    500: 'orange',
    1000: 'red'
  };

  
const isResponseTime = obj => obj && obj.req && obj.res && obj.time;

const getRangeValue = obj => (value, def) => {
    const key = Object.keys(obj).reduce((acc, cur) => value > cur ? cur : acc);
    return obj[key] || def;
};
  
const getStatusColor = getRangeValue(statusColors);
const getTimingColor = getRangeValue(timingColors);

const formatResponseTime = obj => {
let {
    req,
    res,
    time
} = obj;
const {
    method,
    url
} = req;
let {
    statusCode
} = res;
const statusColor = getStatusColor(statusCode);

if (statusColor) {
    statusCode = chalk[statusColor](statusCode);
}

const timingColor = getTimingColor(time);

if (timingColor) {
    time = chalk[timingColor](time.toFixed(2));
}

return `${statusCode} ${method} ${url} - ${time}ms`;
};


/**
 * SPOO Related formatters.
 */

const isSpooMongoDb = obj => obj && obj._id && obj.role;
const isSpoo = obj => obj && obj.created && obj.role;
const formatSpooMDB = obj => `SpooObject[${obj.role}][MDB: ${obj._id}]`; //Format web push subscriptions keys.
const formatSpoo = obj => `SpooObject[${obj.role}]`; //Format web push subscriptions keys.

const hasLogCfg = obj => obj && obj.LOG_LEVEL || obj.LOG_SCOPE || obj.LOG_FILTER;
const formatLogCfg = obj => `LogConfig[${JSON.stringify(obj)}]`;
module.exports = {
    isResponseTime,
    formatResponseTime,
    isSpooMongoDb,
    isSpoo,
    formatSpoo,
    formatSpooMDB,
    hasLogCfg,
    formatLogCfg
}