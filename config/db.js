if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongodbURI: "mongodb://myDay:JetyoxBitpyctA7@ds131902.mlab.com:31902/myday"
  }
} else {
  module.exports = {
    mongodbURI: "mongodb://localhost:27017/vidjot"
  }
}