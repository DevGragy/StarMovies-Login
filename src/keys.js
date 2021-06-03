require('dotenv').config()

module.exports = {
    mongodb: {
      URI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kmcgx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    }
  };