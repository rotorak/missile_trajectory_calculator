FROM node:18-slim

# Install Python 3
RUN apt-get update && apt-get install -y python3

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]
