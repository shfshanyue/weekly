const glob = require('fast-glob')
const maxBy = require('midash').maxBy

async function getMaxWeek() {
  // 使用glob异步地获取所有匹配的文件名
  const files = await glob('content/blog/week-*[0-9].md');

  // 提取文件名中的数字部分，并转换为数字数组
  const numbers = files.map(file => parseInt(file.match(/\d+/)[0], 10));

  // 找到数组中的最大值
  const maxNumber = maxBy(numbers, Number);

  // 确保结果为数字，避免意外类型
  return Number(maxNumber);
}

exports.getMaxWeek = getMaxWeek