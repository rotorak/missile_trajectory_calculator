// start.js
console.log('Starting application...');
console.log('Node version:', process.version);
console.log('Working directory:', process.cwd());
console.log('Environment:', process.env.NODE_ENV);
console.log('PORT from env before setting:', process.env.PORT);

// Cloud Run sets PORT, but ensure it's available
// Default to 8080 if not set (Cloud Run standard)
if (!process.env.PORT) {
  console.warn('WARNING: PORT not set, defaulting to 8080');
  process.env.PORT = '8080';
} else {
  console.log('PORT is set to:', process.env.PORT);
}

// Force PORT to 8080 for Cloud Run (Cloud Run always uses 8080)
// This ensures consistency even if Cloud Run doesn't set it properly
process.env.PORT = process.env.PORT || '8080';
console.log('PORT will be used as:', process.env.PORT);

try {
  console.log('Attempting to load server...');
  await import('./dist/server.js');
  console.log('Server module loaded successfully');
} catch (error) {
  console.error('Failed to load server module:', error);
  console.error('Error name:', error.name);
  console.error('Error message:', error.message);
  console.error('Error stack:', error.stack);
  process.exit(1);
}