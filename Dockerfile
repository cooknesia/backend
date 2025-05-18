# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all source files
COPY . .

# Expose port (default 5000)
EXPOSE 5000

# Set environment variables (can be overridden at runtime)
ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0


# Start the server
CMD ["node", "server.js"]
