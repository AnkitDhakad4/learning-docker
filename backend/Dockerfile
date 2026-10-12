FROM node:22-alpine

# made a working folder in the image(which will be converted into the container)
WORKDIR /server

# ./ means the current directory
COPY package*.json ./

RUN npm install

# copy everything within this foler(backend) to the working directory(server in the container)
COPY . .

# this port must be same as the port where our backend server is linstening on or the .env PROT
EXPOSE 3000

CMD ["npm","start"]
