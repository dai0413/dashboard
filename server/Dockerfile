FROM mcr.microsoft.com/playwright:v1.61.1-noble

WORKDIR /app

COPY package*.json ./
COPY .npmrc ./

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/app.js"] 