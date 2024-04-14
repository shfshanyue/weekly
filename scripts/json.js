// 将指定范围内的 YAML 文件批量转换为 JSON 格式。
// 该脚本会检查 `docs` 目录下是否存在以 `week-` 开头，后跟数字，`.yaml` 结尾的文件。
// 如果存在，它将读取这些 YAML 文件，将它们转换为 JSON，并将结果写入 `static` 目录下的相应文件中。

// 同：seq 1 100 | xargs -I {} sh -c '[ -f docs/week-{}.yaml ] && js-yaml docs/week-{}.yaml > static/week-{}.json'

const fs = require('fs');
const jsYaml = require('js-yaml');

for (let i = 1; i <= 100; i++) {
  let yamlPath = `docs/week-${i}.yaml`;
  if (fs.existsSync(yamlPath)) {
    const yamlFile = fs.readFileSync(yamlPath, 'utf8');
    const jsonContent = jsYaml.load(yamlFile);
    fs.writeFileSync(`static/week-${i}.json`, JSON.stringify(jsonContent, null, 2));
  }
}