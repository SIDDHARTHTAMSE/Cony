# Use the official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Install nodemon globally for development
RUN npm install -g nodemon

# Copy the rest of the application code
COPY . .

# Expose the port your app will use
EXPOSE 8080

# Default command to run with nodemon
CMD ["nodemon", "index.js"]
