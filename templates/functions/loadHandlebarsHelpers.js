/* eslint-disable @typescript-eslint/no-var-requires */
const handlebars = require('handlebars')
const customHelpers = require('./handlebarsHelpers')

customHelpers(handlebars)

console.log('Handlebars helpers loaded successfully')
