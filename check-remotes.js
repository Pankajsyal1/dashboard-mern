const http = require('http');
const ports = [3001, 3002, 3003, 3004];
let completed = 0;
ports.forEach(port => {
  const req = http.request({ hostname: 'localhost', port, method: 'HEAD', path: '/remoteEntry.js', timeout: 2000 }, res => {
    console.log(port, 'status', res.statusCode);
    res.resume();
    completed += 1;
    if (completed === ports.length) process.exit(0);
  });
  req.on('error', err => {
    console.log(port, 'error', err.message);
    completed += 1;
    if (completed === ports.length) process.exit(0);
  });
  req.on('timeout', () => {
    console.log(port, 'timeout');
    req.destroy();
    completed += 1;
    if (completed === ports.length) process.exit(0);
  });
  req.end();
});
