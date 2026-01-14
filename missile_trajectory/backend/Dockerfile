# Use Node.js 18 as the base image
FROM node:18-slim

# 1. Install Python 3 and pip (required for missile.py)
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# 2. Set working directory
WORKDIR /app

# 3. Copy package files and install Node dependencies
COPY package*.json ./
RUN npm install
RUN npm install -g typescript ts-node

# 4. Copy the rest of the backend code
COPY . .

# 5. Cloud Run injects the PORT environment variable, usually 8080.
# Your server.ts already handles process.env.PORT, which is perfect.
ENV PORT=8080

# 6. Start the server
# Using ts-node for simplicity.
CMD ["ts-node", "src/server.ts"]
