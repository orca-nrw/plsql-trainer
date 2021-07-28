# Currently using Node 14
FROM node:fermium

# Using /app as project directory
WORKDIR /app

# install required dependencies
RUN apt-get update && \
    apt-get --allow-unauthenticated install unzip libaio1 -y

# Bundle app source
COPY /oracle /app/oracle

# unzip Oracle files
RUN unzip /app/oracle/instantclient-basic-linux.x64-21.1.0.0.0.zip -d /opt/oracle && \
    unzip /app/oracle/instantclient-sdk-linux.x64-21.1.0.0.0.zip -d /opt/oracle

# configure oracle client files
# WORKDIR /opt/oracle/instantclient_21_1

# copy .ora file in order to recognize connection string containing an SID instead of a service name
# RUN mkdir -p /opt/oracle/instantclient_21_1/network/admin
# COPY /src/oracle/tnsnames.ora /opt/oracle/instantclient_21_1/network/admin

# remove unnecessary files from the app
RUN rm -r /app/oracle

# export necessary paths
ENV LD_LIBRARY_PATH="/opt/oracle/instantclient_21_1:$LD_LIBRARY_PATH"
ENV ORA_SDTZ="UTC"

EXPOSE 8282

WORKDIR /app

# Installing dependencies
COPY package*.json ./
RUN npm install

# Copy source code into container
COPY ./src ./src

# Run the server
CMD ["node", "src/app.js"]
