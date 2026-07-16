const http = require('http');

const testRegister = async () => {
  const data = JSON.stringify({
    name: 'Admin User',
    email: 'admin' + Date.now() + '@example.com',
    password: 'password123',
    role: 'ADMIN'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let body = '';
      res.on('data', d => {
        body += d;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body });
      });
    });

    req.on('error', error => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

testRegister().then(res => {
  console.log('Register API Response:');
  console.log('Status:', res.statusCode);
  console.log('Body:', res.body);
}).catch(console.error);
