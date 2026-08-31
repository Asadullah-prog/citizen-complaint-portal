FROM node:20-alpine

WORKDIR /app

# Copy package manifests
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies in both root and server
RUN npm install --omit=dev
RUN npm --prefix server install --omit=dev

# Copy entire source code
COPY . .

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server/src/server.js"]
