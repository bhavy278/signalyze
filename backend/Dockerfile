# Use official Node.js LTS image as base
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies (including dev dependencies needed for build)
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Expose the port your app runs on (assume 3000, adjust if needed)
EXPOSE 3000

# Start the app
CMD ["node", "dist/app.js"]