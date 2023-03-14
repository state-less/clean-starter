import chalk from 'chalk';

const statusColors = {
    200: 'green',
    300: 'blue',
    400: 'orange',
    500: 'red',
};

const timingColors = {
    0: 'green',
    200: 'yellow',
    500: 'orange',
    1000: 'red',
};

const isResponseTime = (obj) => obj && obj.req && obj.res && obj.time;

const getRangeValue = (obj) => (value, def?) => {
    const key = Object.keys(obj).reduce((acc, cur) =>
        value > cur ? cur : acc
    );
    return obj[key] || def;
};

const getStatusColor = getRangeValue(statusColors);
const getTimingColor = getRangeValue(timingColors);

const formatResponseTime = (obj) => {
    let { req, res, time } = obj;
    const { method, url } = req;
    let { statusCode } = res;
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

const hasLogCfg = (obj) =>
    (obj && obj.LOG_LEVEL) || obj.LOG_SCOPE || obj.LOG_FILTER;
const formatLogCfg = (obj) => `LogConfig[${JSON.stringify(obj)}]`;

export { isResponseTime, formatResponseTime, hasLogCfg, formatLogCfg };
