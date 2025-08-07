# 1. Start with a Node.js image based on Debian Linux
FROM node:18-slim

# 2. Install LibreOffice using the system's package manager
# This is the step that Netlify cannot do.
RUN apt-get update && apt-get install -y libreoffice && apt-get clean

# 3. Set up the working directory inside the container
WORKDIR /usr/src/app

# 4. Copy your package.json files and install dependencies
COPY package*.json ./
RUN npm install

# 5. Copy the rest of your backend source code
COPY . .

# 6. Build your TypeScript code into JavaScript
RUN npm run build

# 7. Expose the port your server runs on
EXPOSE 5001

# 8. Define the command to start your server
CMD [ "node", "dist/server.js" ]