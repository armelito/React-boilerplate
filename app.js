require('dotenv').config()

const path = require('path')
const http = require('http')
const express = require('express')
const engine = require('express-engine-jsx');
const bodyParser = require('body-parser')
const errorHandler = require('errorhandler')
const methodOverride = require('method-override')
const cors = require("cors")
const logger = require("morgan")

const app = express()
const port = process.env.PORT || 3000
const UAParser = require('ua-parser-js')

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')
const { cpuUsage } = require('process')
const { each } = require('lodash')

const apiEndpoint = process.env.PRISMIC_ENDPOINT
const accessToken = process.env.PRISMIC_ACCESS_TOKEN

const initApi = req =>
{
  return Prismic.getApi(apiEndpoint,
  {
    accessToken: accessToken,
    req: req
  })
}

const handleLinkResolver = doc =>
{
  if (doc.type === 'about')
    return `/about`

  return '/'
}

app.use(logger('dev'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(express.static(path.join(__dirname, 'public')))
app.use(errorHandler())

app.use((req, res, next) =>
{
  const ua = UAParser(req.headers['user-agent'])

  res.locals.isDesktop = ua.device.type === undefined
  res.locals.isPhone = ua.device.type === 'mobile'
  res.locals.isTablet = ua.device.type === 'tablet'
  res.locals.link = handleLinkResolver
  res.locals.PrismicDOM = PrismicDOM

  res.locals.Numbers = index =>
  {
    return index == 0 ? 'One' : 'two'
  }

  next()
})

app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'jsx')
app.engine('jsx', engine)

const handleRequest = async api =>
{
  const meta = await api.getSingle('meta')
  const navigation = await api.getSingle('navigation')
  const preloader = await api.getSingle('preloader')

  return {
    meta,
    navigation,
    preloader
  }
}

app.get('/', async (req, res) =>
{
  const api =  await initApi(req)
  const defaults = await handleRequest(api)
  const home = await api.getSingle('home')
  const { results: collections } = await api.query(Prismic.Predicates.at( 'document.type', 'collection' ),
    {
      fetchLinks: ['product.image', 'product.title', 'product.description']
    }
  )

  res.render('pages/home',
  {
    ...defaults,
    home,
    collections,
  })
})

app.get('/about', async (req, res) =>
{
  const api =  await initApi(req)
  const defaults = await handleRequest(api)
  const about = await api.getSingle('about')

  res.render('pages/about',
  {
    ...defaults,
    about
  })
})

app.get('/collections', async (req, res) =>
{
  const api =  await initApi(req)
  const defaults = await handleRequest(api)
  const home = await api.getSingle('home')
  const { results: collections } = await api.query(Prismic.Predicates.at( 'document.type', 'collection' ),
    { fetchLinks: ['product.image', 'product.title', 'product.description'] }
  )

  res.render('pages/collections',
  {
    ...defaults,
    home,
    collections
  })
})

app.get('/collections/:uid', async (req, res) =>
{
  const api =  await initApi(req)
  const defaults = await handleRequest(api)
  const project = await api.getByUID
  (
    'project',
    req.params.uid,
    { fetchLinks: 'collection.title' }
  )

  res.render('pages/product',
  {
    ...defaults,
    project
  })
})

app.listen(port, () =>
{
  console.log(`App listening at http://localhost:${port}`)
})
