db.createUser({
  user: process.env.MONGO_DEV_USERNAME,
  pwd: process.env.MONGO_DEV_PASSWORD,
  roles: [
    {
      role: 'readWrite',
      db: 'denimintsaev',
    },
  ],
});
