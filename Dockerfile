FROM node:14.17.6-alpine3.14
RUN mkdir -p /home/mod-checkup-backend
WORKDIR /home/mod-checkup-backend
COPY . /home/mod-checkup-backend/
RUN npm install
EXPOSE 5000
CMD ["node", "server.js"]