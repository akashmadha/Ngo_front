const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/admin/om-members-full-details',
  method: 'GET',
  headers: {
    'user-id': '1'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('API Response for first member:');
      console.log(JSON.stringify(jsonData[0], null, 2));
      
      if (jsonData[0] && jsonData[0]['User Registration Details']) {
        console.log('\nUser Registration Details:');
        console.log(JSON.stringify(jsonData[0]['User Registration Details'], null, 2));
      }
    } catch (error) {
      console.error('Error parsing response:', error);
    }
  });
});

req.on('error', (error) => {
  console.error('Error making request:', error);
});

req.end(); 