# Use Node.js 20.11.1 as the base image
FROM node:20.11.1 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the remaining app files to the working directory
COPY . .

# Build the React app
RUN npm run build

# Use Nginx as a lightweight HTTP server
FROM nginx:alpine

# Copy the built files from the build stage to the nginx directory
COPY --from=build /app/build /app

# Overwrite existing conf in Pod
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start nginx when the container starts
ENTRYPOINT ["nginx", "-g", "daemon off;"]
