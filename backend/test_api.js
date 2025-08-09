const fetch = require('node-fetch');

async function testAPI() {
  try {
    const response = await fetch('http://localhost:3001/api/admin/om-members-full-details', {
      headers: {
        'user-id': '1'
      }
    });
    
    const data = await response.json();
    console.log('API Response for first member:');
    console.log(JSON.stringify(data[0], null, 2));
    
    // Check User Registration Details specifically
    if (data[0] && data[0]['User Registration Details']) {
      console.log('\nUser Registration Details:');
      console.log(JSON.stringify(data[0]['User Registration Details'], null, 2));
    }
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAPI(); 