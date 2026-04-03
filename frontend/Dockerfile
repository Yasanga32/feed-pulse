FROM node:20-alpine

WORKDIR /app

# Accept build argument
ARG NEXT_PUBLIC_API_URL

# Set env variable
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the Next.js frontend
RUN npm run build

# Expose the frontend port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]