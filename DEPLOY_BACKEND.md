# Deploying the Backend

Deploying the FastAPI backend requires a platform that can run Python applications. A popular choice for this is Heroku, as it has a generous free tier and is relatively easy to get started with.

This guide provides a general overview of the steps to deploy your backend to Heroku.

## 1. Create a `Procfile`

Heroku needs to know how to start your application. You do this by creating a `Procfile` in the `backend/` directory. The file should contain the following line:

```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

This tells Heroku to start a web process using `uvicorn`.

## 2. Install `gunicorn`

While `uvicorn` is great for development, it's recommended to use `gunicorn` as a process manager in production. `gunicorn` will manage `uvicorn` for you.

Add `gunicorn` to your `backend/requirements.txt`:

```
fastapi
uvicorn[standard]
pymongo
pydantic
python-jose[cryptography]
fastapi-mail
python-dotenv
passlib[bcrypt]
gunicorn
```

Then, update your `Procfile` to use `gunicorn`:

```
web: gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

## 3. Set up a Heroku Account and the Heroku CLI

*   Create a free account on [Heroku](https://www.heroku.com/).
*   Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) on your computer.

## 4. Create a Heroku App

1.  Open your terminal and log in to Heroku:

    ```bash
    heroku login
    ```

2.  Create a new Heroku app:

    ```bash
    heroku create your-app-name
    ```

    Replace `your-app-name` with a unique name for your application.

## 5. Configure Environment Variables

Your application needs environment variables for your `MONGO_URL`, `JWT_SECRET_KEY`, and `RESEND_API_KEY`. You need to set these in Heroku:

```bash
heroku config:set MONGO_URL="your-mongodb-uri"
heroku config:set JWT_SECRET_KEY="your-super-secret-key"
heroku config:set RESEND_API_KEY="your-resend-api-key"
```

**Important:** You will need to use a cloud-hosted MongoDB database, such as [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), for your deployed application. You cannot use `mongodb://localhost:27017` in production.

## 6. Deploy to Heroku

1.  Initialize a git repository in your `backend` directory if you haven't already:

    ```bash
    git init
    heroku git:remote -a your-app-name
    ```

2.  Commit your changes and push to Heroku:

    ```bash
    git add .
    git commit -am "make it deploy"
    git push heroku main
    ```

Heroku will now build and deploy your application. You can view the logs with `heroku logs --tail`.

## 7. Update Frontend API URLs

Once your backend is deployed, Heroku will give you a URL for it (e.g., `https://your-app-name.herokuapp.com`). You need to use this URL in your frontend code, as described in the `DEPLOY_FRONTEND.md` guide.
