require('dotenv').config();

async function testOdooConnection() {
  console.log('🔗 Testing Odoo XML-RPC connection...');
  
  const credentials = {
    url: process.env.ODOO_URL,
    database: process.env.ODOO_DATABASE,
    username: process.env.ODOO_USERNAME,
    apiKey: process.env.ODOO_API_KEY
  };

  console.log('URL:', credentials.url);
  console.log('Database:', credentials.database);
  console.log('Username:', credentials.username);
  console.log('API Key:', credentials.apiKey ? '***' + credentials.apiKey.slice(-4) : 'Not set');

  if (!credentials.url || !credentials.database || !credentials.username || !credentials.apiKey) {
    console.error('❌ Missing credentials');
    return;
  }

  // Test XML-RPC authentication
  const xmlRequest = `<?xml version="1.0"?>
<methodCall>
  <methodName>authenticate</methodName>
  <params>
    <param><value><string>${credentials.database}</string></value></param>
    <param><value><string>${credentials.username}</string></value></param>
    <param><value><string>${credentials.apiKey}</string></value></param>
    <param><value><struct></struct></value></param>
  
