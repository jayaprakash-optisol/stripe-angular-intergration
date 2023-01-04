FROM node:18

# Working Dir
WORKDIR /usr/src/app

# Copy package.json files
COPY package*.json ./

# Install npm packages
RUN npm install

# Copy source files
COPY . .

# Build
RUN npm run build

# Expose the API Port
EXPOSE 5000

CMD ["node", "build/server.js"]