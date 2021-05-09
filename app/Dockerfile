# Currently using Node 14
FROM node:fermium

# Using /app as project directory
WORKDIR /app

# Installing dependencies
COPY src/package*.json ./
RUN npm install

# Copy source code into container
COPY . .
