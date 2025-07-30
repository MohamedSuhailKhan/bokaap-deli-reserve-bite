# Setting up MongoDB with Docker

This guide will walk you through setting up a local MongoDB database using Docker. This is a great way to get a database running for development without having to install MongoDB directly on your system.

## 1. Install Docker

If you don't already have Docker installed, you'll need to download and install it from the official Docker website:

*   [Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
*   [Docker for Windows](https://docs.docker.com/docker-for-windows/install/)
*   [Docker for Linux](https://docs.docker.com/engine/install/)

## 2. Run the MongoDB Docker Container

Once you have Docker installed, you can run a MongoDB container with a single command. Open your terminal and run the following:

```bash
docker run -d -p 27017:27017 --name my-mongo mongo
```

This command does the following:

*   `docker run`:  Starts a new Docker container.
*   `-d`: Runs the container in detached mode (in the background).
*   `-p 27017:27017`: Maps port 27017 on your local machine to port 27017 in the container. This is the default port for MongoDB.
*   `--name my-mongo`: Gives the container a name, so you can easily refer to it later.
*   `mongo`:  Specifies the Docker image to use (in this case, the official MongoDB image).

## 3. Connect to Your Database

Your MongoDB instance is now running. You can connect to it using the following connection string:

```
mongodb://localhost:27017
```

You should use this connection string in your `backend/.env` file for the `MONGO_URL` variable.

## 4. (Optional) Use a GUI Client

It can be helpful to use a graphical user interface (GUI) client to view and manage your data. A popular choice is [MongoDB Compass](https://www.mongodb.com/products/compass). You can download it for free and connect to your local database using the connection string above.

## 5. Stopping and Starting the Container

*   To **stop** the container, run: `docker stop my-mongo`
*   To **start** the container again, run: `docker start my-mongo`

That's it! You now have a local MongoDB database running in a Docker container, ready to be used with your FastAPI application.
