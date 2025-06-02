const colors = {
  GET: '\x1b[32m',
  POST: '\x1b[36m',
  PUT: '\x1b[33m',
  DELETE: '\x1b[31m',
  PATCH: '\x1b[35m',
  DEFAULT: '\x1b[37m',
  SUCCESS: '\x1b[32m',
  ERROR: '\x1b[31m',
  RESET: '\x1b[0m',
};

module.exports = (method, path, statusCode = 200) => {
  const upperMethod = method.toUpperCase();
  const methodColor = colors[upperMethod] || colors.DEFAULT;
  const statusColor = statusCode >= 400 ? colors.ERROR : colors.SUCCESS;
  const statusEmoji = statusCode >= 400 ? '❌' : '✅';
  const reset = colors.RESET;

  console.log(
    `${statusColor}${statusEmoji}${reset} ${methodColor}${upperMethod}${reset} ${path} → ${statusColor}${statusCode}${reset}`,
  );
};
