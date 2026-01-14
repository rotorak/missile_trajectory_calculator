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

# 6. Cloud Run injects the PORT environment variable, usually 8080.
# Your server.ts already handles process.env.PORT, which is perfect.
ENV PORT=8080
ENV NODE_ENV=production

# 7. Expose the port (informational, Cloud Run uses PORT env var)
EXPOSE 8080

# 8. Start the server using the compiled JavaScript
# This is more reliable than ts-node in production
CMD ["node", "dist/server.js"]