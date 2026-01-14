# Use Node.js 18 as the base image
FROM node:18-slim

# 1. Install Python 3 and pip (required for missile.py)
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# 2. Set working directory
WORKDIR /app

# 3. Copy package files and install Node dependencies
COPY package*.json ./
RUN npm ci --only=production=false

# 4. Copy the rest of the backend code
COPY . .

# 5. Remove any existing dist folder and build TypeScript code
RUN rm -rf dist/ && npm run build

# 6. Verify build output exists and show structure
RUN ls -la dist/ || (echo "Build failed: dist directory not found" && exit 1)
RUN test -f dist/server.js || (echo "Build failed: dist/server.js not found" && exit 1)
RUN test -f dist/simulation-controller.js || (echo "Build failed: dist/simulation-controller.js not found" && exit 1)

# 7. Verify the compiled code has PORT = 8080
RUN grep -q "const PORT = 8080" dist/server.js || (echo "ERROR: Compiled code does not have PORT = 8080!" && cat dist/server.js | grep "const PORT" && exit 1)

# 8. Verify missile.py exists
RUN test -f missile.py || (echo "missile.py not found" && exit 1)

# 9. Cloud Run will inject PORT=8080 automatically, no need to set it here
ENV NODE_ENV=production

# 10. Expose the port (informational, Cloud Run uses PORT env var)
EXPOSE 8080

# 11. Start the server with better error visibility
CMD ["node", "--trace-warnings", "--trace-uncaught", "start.js"]