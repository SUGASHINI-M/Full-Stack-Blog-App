# Register on the blog

## 1. Start MongoDB

Start your local MongoDB service, or create a MongoDB Atlas database.
MongoDB creates the `blog` database and its collections automatically when the API first connects.

## 2. Configure the API

In `api/.env`, set your MongoDB connection details:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=blog
```

For MongoDB Atlas, set `MONGODB_URI` to your Atlas connection string.

## 3. Start the app and register

1. In **api** folder: `npm start`
2. In **client** folder: `npm start`
3. Open http://localhost:3000 → click **Register** → fill username, email, password → Register
4. Then **Login** with the same username and password

Done.
