const glob = require('fast-glob')
const maxBy = require('lodash/maxBy')

function getMaxWeek () {
  return glob('docs/week-*[1-9].yaml').then(files => {
    return files.map(file => file.match(/\d+/)[0])
  }).then(numbers => {
    return maxBy(numbers, Number)
  }).then(Number)
}

exports.getMaxWeek = getMaxWeek