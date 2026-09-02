FROM mcr.microsoft.com/playwright:v1.61.1-noble

WORKDIR /app

COPY package*.json ./
COPY .npmrc ./

ARG NODE_AUTH_TOKEN

RUN echo "TOKEN LENGTH: ${#NODE_AUTH_TOKEN}"

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/app.js"]