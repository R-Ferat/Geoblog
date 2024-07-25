// netlify/functions/contact.js

const fs = require('fs');
const path = require('path');

// Define the path for storing files
const dataDir = path.join(__dirname, 'data');
const filePath = path.join(dataDir, 'contact_data.json');

// Ensure the directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { nombre, email, mensaje } = body;
    
    const data = {
      nombre,
      email,
      mensaje,
      timestamp: new Date().toISOString()
    };

    // Read existing data if the file exists
    let existingData = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    }

    // Add new data to the existing data
    existingData.push(data);

    // Write all data back to the file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form data saved successfully!' }),
    };
  } catch (error) {
    console.error("Error processing the request:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error', error: error.message }),
    };
  }
};
