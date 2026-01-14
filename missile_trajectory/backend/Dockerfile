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

# 5. VERIFY SOURCE CODE - Print what's actually in the source files
RUN echo "=== VERIFYING SOURCE CODE ===" && \
    echo "--- Checking src/server.ts PORT value ---" && \
    grep -A 2 "const PORT" src/server.ts && \
    echo "--- File timestamp ---" && \
    ls -la src/server.ts && \
    echo "--- First 50 lines of server.ts ---" && \
    head -50 src/server.ts | tail -20 && \
    echo "=== SOURCE VERIFICATION COMPLETE ==="

# 6. Remove any existing dist folder and build TypeScript code
RUN rm -rf dist/ && npm run build

# 7. VERIFY COMPILED CODE - Print what's actually in the compiled output
RUN echo "=== VERIFYING COMPILED CODE ===" && \
    echo "--- Checking dist/server.js PORT value ---" && \
    grep -A 2 "const PORT" dist/server.js && \
    echo "--- File size and timestamp ---" && \
    ls -lh dist/server.js && \
    echo "--- First 50 lines of compiled server.js ---" && \
    head -50 dist/server.js | tail -20 && \
    echo "=== COMPILED CODE VERIFICATION COMPLETE ==="

# 8. Verify build output exists and show structure
RUN ls -la dist/ || (echo "Build failed: dist directory not found" && exit 1)
RUN test -f dist/server.js || (echo "Build failed: dist/server.js not found" && exit 1)
RUN test -f dist/simulation-controller.js || (echo "Build failed: dist/simulation-controller.js not found" && exit 1)

# 9. Final verification - Verify PORT uses environment variable (Cloud Run sets PORT=8080)
RUN grep -q "process.env.PORT" dist/server.js || (echo "ERROR: Compiled code does not use process.env.PORT!" && echo "Actual PORT value found:" && grep "const PORT" dist/server.js && exit 1)

# 10. Verify missile.py exists
RUN test -f missile.py || (echo "missile.py not found" && exit 1)

# 11. Cloud Run will inject PORT=8080 automatically, no need to set it here
ENV NODE_ENV=production

# 12. Expose the port (informational, Cloud Run uses PORT env var)
EXPOSE 8080

# 13. Start the server with better error visibility
CMD ["node", "--trace-warnings", "--trace-uncaught", "start.js"]