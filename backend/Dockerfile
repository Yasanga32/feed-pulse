FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the project (compiles TypeScript to JavaScript)
RUN npm run build

# Expose the API port
EXPOSE 4000

# Start the Node.js server
CMD ["npm", "start"]

