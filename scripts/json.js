// 将指定范围内的 YAML 文件批量转换为 JSON 格式。
// 该脚本会检查 `docs` 目录下是否存在以 `week-` 开头，后跟数字，`.yaml` 结尾的文件。
// 如果存在，它将读取这些 YAML 文件，将它们转换为 JSON，并将结果写入 `static` 目录下的相应文件中。

// 同：seq 1 100 | xargs -I {} sh -c '[ -f docs/week-{}.yaml ] && js-yaml docs/week-{}.yaml > static/week-{}.json'

const fs = require('fs');
const jsYaml = require('js-yaml');
const { getMaxWeek } = require('./max-week');

// 定义最大周数为常量，以提高代码的可读性和易维护性
const MAX_WEEK = 100;

// 封装读取并转换 YAML 文件的函数
async function convertYamlToJson(yamlPath, jsonPath) {
  try {
    // 使用异步读取文件内容，提高性能
    const yamlFile = await fs.promises.readFile(yamlPath, 'utf8');
    const jsonContent = jsYaml.load(yamlFile);
    await fs.promises.writeFile(jsonPath, JSON.stringify(jsonContent, null, 2));
  } catch (error) {
    console.error(`Error converting ${yamlPath} to ${jsonPath}: ${error}`);
  }
}

// 批量转换 YAML 文件
async function batchConvertYaml() {
  for (let i = 1; i <= MAX_WEEK; i++) {
    const yamlPath = `docs/week-${i}.yaml`;
    const jsonPath = `static/week-${i}.json`;
    if (fs.existsSync(yamlPath)) {
      await convertYamlToJson(yamlPath, jsonPath);
    }
  }
}

// 处理最新周数的 YAML 文件转换
async function convertLatestWeekYaml() {
  const latestWeek = await getMaxWeek(); // 假设 getMaxWeek 已经是异步函数
  const yamlPath = `docs/week-${latestWeek}.yaml`;
  const jsonPath = `static/week-latest.json`;

  if (fs.existsSync(yamlPath)) {
    await convertYamlToJson(yamlPath, jsonPath);
  }
}

// 主函数，启动批量转换和最新周数的转换
async function main() {
  try {
    await batchConvertYaml();
    await convertLatestWeekYaml();
    console.log('Conversion complete.');
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

main();