FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install --production
ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "index.js"]
