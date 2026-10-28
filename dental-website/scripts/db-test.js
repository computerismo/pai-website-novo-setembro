const { Client } = require('pg');

async function testConnection() {
  const configs = [
    { host: 'localhost', user: 'postgres', password: 'postgres', database: 'dental_db' },
    { host: '127.0.0.1', user: 'postgres', password: 'postgres', database: 'dental_db' },
    { host: '::1', user: 'postgres', password: 'postgres', database: 'dental_db' },
  ];

  for (const config of configs) {
    console.log(`Testing config: ${JSON.stringify(config)}`);
    const client = new Client(config);
    try {
      await client.connect();
      console.log('SUCCESS!');
      await client.end();
      process.exit(0);
    } catch (err) {
      console.error(`FAILED: ${err.message}`);
    }
  }
}

testConnection();
