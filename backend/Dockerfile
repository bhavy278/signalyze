# 1. Start with a Node.js image based on Debian Linux
FROM node:18-slim

# 2. Install LibreOffice
RUN apt-get update && apt-get install -y libreoffice && apt-get clean

# 3. Set up the working directory
WORKDIR /usr/src/app

# 4. Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# 5. Copy the rest of your source code (this will now include ca.pem)
COPY . .

# 6. Build your TypeScript code
RUN npm run build

# 7. Manually copy the non-TypeScript assets
COPY src/sql dist/sql

# 8. Expose the port
EXPOSE 5001

# 9. Define the command to start your server
CMD [ "node", "dist/app.js" ]