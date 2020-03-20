module.exports = {
  server: {
    command: `npm run start`,
    port: 10001,
    launchTimeout: 10000,
    debug: true,
  },
  launch: {
    dumpio: true,
    headless: true,
    args: ['--disable-infobars'],
  },
};
