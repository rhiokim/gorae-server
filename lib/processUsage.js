const os = require('os');
const Promise = require('bluebird');
const disk = require('diskusage');

const diskusage = Promise.promisify(disk.check);
const diskMB = diskusage('/').then((state) => {
  return state;
}).catch(err => {
  return err;
});

module.exports = () => ({
  cpus: os.cpus(),
  memory: {
    total: os.totalmem(),
    free: os.freemem(),
    used: os.totalmem() - os.freemem()
  },
  gorae: {
    cpu: process.cpuUsage(),
    memory: process.memoryUsage()
  }
});
