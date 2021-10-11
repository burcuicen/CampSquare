const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/camp-square', {
  useNewUrlParser: true,
  //useCreateIndex: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected')
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]
//remove everything from database first
const seedDB = async () => {
  await Campground.deleteMany({})
  //creating dummy campground data
  for (let i = 0; i < 50; i++) {
    const random80 = Math.floor(Math.random() * 80) //pick a random number to create campgrounds randomly
    const camp = new Campground({
      location: `${cities[random80].city}, ${cities[random80].state}`, //setting random city
      title: `${sample(descriptors)} ${sample(places)}`, //setting random titles combining two objects
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
