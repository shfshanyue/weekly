const glob = require('fast-glob')
const maxBy = require('lodash/maxBy')

function getMaxWeek () {
  return glob('content/blog/week-*[0-9].md').then(files => {
    return files.map(file => file.match(/\d+/)[0])
  }).then(numbers => {
    return maxBy(numbers, Number)
  }).then(Number)
}

exports.getMaxWeek = getMaxWeek