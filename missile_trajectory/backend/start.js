// start.js
console.log('Starting application...');
console.log('Node version:', process.version);
console.log('Working directory:', process.cwd());
console.log('Environment:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

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