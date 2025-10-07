FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --production
COPY . .

# Expose HTTPS (443) and HTTP (80)
EXPOSE 443 80

# Start the HTTPS app
CMD ["npm", "run", "start"]
