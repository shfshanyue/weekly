const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const _ = require('lodash')

const docs = _.range(1, 3).map(n => yaml.load(fs.readFileSync(`./docs/week-${n}.yaml`), 'utf8'))

const tools = _.flatMap(docs, 'tools')
const articles = _.flatMap(docs, 'articles')




