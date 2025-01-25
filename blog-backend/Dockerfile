FROM node:16

WORKDIR /app

COPY ./blog-backend/package*.json ./
RUN npm install

COPY ./blog-backend .

ENV PORT=5000
EXPOSE 5000

CMD ["npm", "start"]
