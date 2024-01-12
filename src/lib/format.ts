const isResponseTime = (obj) => obj && obj.req && obj.res && obj.time;

const hasLogCfg = (obj) =>
    (obj && obj.LOG_LEVEL) || obj.LOG_SCOPE || obj.LOG_FILTER;
const formatLogCfg = (obj) => `LogConfig[${JSON.stringify(obj)}]`;

const isNumber = (obj) => typeof obj === 'number';
const formatNumber = (obj) => `${obj}`;
export { isResponseTime, hasLogCfg, formatLogCfg, isNumber, formatNumber };
