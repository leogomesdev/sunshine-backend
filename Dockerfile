# Development stage
FROM node:18-alpine as development

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install --silent

# Copy the rest of the application to the container
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine as production

# Set the working directory to /app
WORKDIR /app

# Copy the built application from the development stage to the production stage
COPY --from=development /app/build ./build

# Install only production dependencies
COPY package*.json ./
RUN npm install --production --silent

# Expose the port the app listens on
EXPOSE 3001

# Start the app
CMD ["npm", "run start:prod"]
