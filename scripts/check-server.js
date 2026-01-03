#!/usr/bin/env node

/**
 * Check Server Status
 * Quick script to check if backend and frontend are running
 */

const axios = require('axios');

async function checkServer() {
  console.log('🔍 Checking SikshaBuddy Server Status...\n');

  // Check Backend
  try {
    const backendResponse = await axios.get('http://localhost:5000/api/health', { timeout: 2000 });
    console.log('✅ Backend Server: RUNNING on http://localhost:5000');
    console.log('   Response:', backendResponse.data.message, '\n');
  } catch (error) {
    console.log('❌ Backend Server: NOT RUNNING');
    console.log('   Start with: npm run server\n');
  }

  // Check Frontend
  try {
    const frontendResponse = await axios.get('http://localhost:3000', { timeout: 2000 });
    console.log('✅ Frontend: RUNNING on http://localhost:3000\n');
  } catch (error) {
    console.log('⏳ Frontend: Starting or not ready yet');
    console.log('   This is normal if you just started the server\n');
  }

  console.log('💡 Access your app at: http://localhost:3000');
  console.log('💡 API health check: http://localhost:5000/api/health\n');
}

checkServer();


