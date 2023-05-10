# Specify a base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Install FFmpeg and other dependencies
RUN apk add --no-cache ffmpeg

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm cache clean --force 
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the bot will run on
EXPOSE 3000

# Start the bot
CMD ["node", "."]
