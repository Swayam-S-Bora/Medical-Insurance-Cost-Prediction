# This Dockerfile sets up a Node.js environment for the frontend application.

FROM node:24-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the application
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "start"]
