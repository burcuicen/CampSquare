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
  for (let i = 0; i < 350; i++) {
    const random80 = Math.floor(Math.random() * 80) //pick a random number to create campgrounds randomly
    const price = Math.floor(Math.random() * 80) + 10
    const camp = new Campground({
      author: '617c1e09035fd2e8b648f374',
      location: `${cities[random80].city}, ${cities[random80].state}`, //setting random city
      title: `${sample(descriptors)} ${sample(places)}`, //setting random titles combining two objects
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam deleniti consectetur, ducimus earum architecto facilis quas illum ipsum dolore maxime impedit voluptatibus error harum quae inventore omnis quisquam totam sint voluptatem, fugit labore? Error dignissimos minus officia similique. Voluptatibus quasi a modi laudantium, sed beatae, voluptatem dolorum quisquam quam sequi et ullam animi? Aspernatur voluptas nihil repellat voluptates! Tempore deserunt, iusto, quas, non dignissimos cumque expedita veniam mollitia repellendus totam corrupti in dolore maiores dolorum quia? Inventore eius asperiores non eveniet. Quia asperiores nulla alias obcaecati omnis veniam repellat.',
      price,
      geometry:{
          type: 'Point', coordinates: [ cities[random80].longitude,cities[random80].latitude
         ] 
      },
      images: [
        {
          url:
            'https://res.cloudinary.com/camp-square/image/upload/v1636054770/CampSquare/e4ozwjquurdpo4ikrpay.jpg',
          filename: 'CampSquare/e4ozwjquurdpo4ikrpay',
        },
        {
          url:
            'https://res.cloudinary.com/camp-square/image/upload/v1636054770/CampSquare/zid1digbe1mwrpylrhub.jpg',
          filename: 'CampSquare/zid1digbe1mwrpylrhub',
        },
      ],
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
