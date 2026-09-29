# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source files
COPY . .

# Expose backend port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start application
CMD ["node", "src/server.js"]
