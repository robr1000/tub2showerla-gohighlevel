const fetch = require('node-fetch');

// Rob's verified working credentials
const credentials = {
  url: 'https://true-north-kitchen-bath-robr100.odoo.com',
  database: 'true-north-kitchen-bath-robr100',
  username: 'rradosta1@gmail.com',
  apiKey: 'c1dbb5fb00bfe7cab61547fb5794d6135f792aa6',
  userId: 2,
  qualifiedStageId: 2
};

async function testDirectOdooConnection() {
  try {
    console.log('🧪 Testing direct Odoo connection with JSON-RPC...');
    
    // Try JSON-RPC approach (different from XML-RPC)
    const response = await fetch(`${credentials.url}/jsonrpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'object',
          method: 'execute_kw',
          args: [
            credentials.database,
            credentials.userId,
            credentials.apiKey,
            'crm.lead',
            'create',
            [{
              name: 'Direct Test Lead - ' + new Date().toISOString(),
              partner_name: 'Test Customer Direct',
              email_from: 'test-direct@example.com',
              phone: '(555) 123-4567',
              mobile: '(555) 123-4567',
              street: '123 Direct Test Street, Los Angeles, CA',
              description: 'Test lead created by direct JSON-RPC test',
              stage_id: credentials.qualifiedStageId
            }]
          ]
        },
        id: Math.floor(Math.random() * 1000000)
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('📨 Response received:', JSON.stringify(result, null, 2));
    
    if (result.error) {
      console.error('❌ Odoo returned error:', result.error);
      return false;
    }

    if (result.result) {
      console.log('✅ SUCCESS! Lead created with ID:', result.result);
      return result.result;
    }

    return false;
    
  } catch (error) {
    console.error('❌ Direct test failed:', error.message);
    return false;
  }
}

testDirectOdooConnection().then(result => {
  if (result) {
    console.log(`🎉 Direct Odoo connection successful! Created lead ID: ${result}`);
  } else {
    console.log('❌ Direct Odoo connection failed');
  }
});
