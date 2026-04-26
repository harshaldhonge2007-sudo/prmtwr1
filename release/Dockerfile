FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
ENV PORT=8080
ENV NODE_ENV=production
ENV FRONTEND_PATH=/app/public
EXPOSE 8080
CMD ["node", "dist/index.js"]
