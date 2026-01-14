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

# 5. Build TypeScript code
RUN npm run build

# 6. Verify build output exists and show structure
RUN ls -la dist/ || (echo "Build failed: dist directory not found" && exit 1)
RUN test -f dist/server.js || (echo "Build failed: dist/server.js not found" && exit 1)
RUN test -f dist/simulation-controller.js || (echo "Build failed: dist/simulation-controller.js not found" && exit 1)

# 7. Verify missile.py exists
RUN test -f missile.py || (echo "missile.py not found" && exit 1)

# 8. Cloud Run injects the PORT environment variable, usually 8080.
ENV PORT=8080
ENV NODE_ENV=production

# 9. Expose the port (informational, Cloud Run uses PORT env var)
EXPOSE 8080

# 10. Start the server with better error visibility
CMD ["node", "--trace-warnings", "--trace-uncaught", "start.js"]