let fs = require("fs");
let path = require("path");
const { execSync } = require("child_process");
const publishPosition = "npm publish"; // 发布
const filesDir = "./node_modules/"; // 待publish文件地址
let files = fs.readdirSync(filesDir);
files.forEach((file) => {
  if (!file.includes(".")) {
    recursionReaddir(file);
  }
});

/**
 * 递归读取文件夹
 */
function recursionReaddir(file) {
  let stats = fs.statSync(filesDir + file);
  if (stats.isDirectory()) {
    let npm_files = fs.readdirSync(filesDir + file);
    if (npm_files.includes("package.json")) {
      const fullFilePath = path.resolve(__dirname, filesDir + file);
      removeExtraProperties(fullFilePath + "/package.json");

      console.log(fullFilePath + " publish 开始");
      try {
        execSync(publishPosition + " " + fullFilePath);
        console.log(fullFilePath + " publish 成功");
      } catch (error) {
        console.error(fullFilePath + " publish 失败");
      }
    } else {
      npm_files.forEach((npm_file) => {
        recursionReaddir(file + "/" + npm_file);
      });
    }
  }
}

/**
 * 去除多余属性
 */
function removeExtraProperties(file_path) {
  const hooks = [
    "prepublish",
    "prepare",
    "prepublishOnly",
    "publish",
    "postpublish",
  ];
  let packageJson = require(file_path);
  if (packageJson.publishConfig)
    Reflect.deleteProperty(packageJson, "publishConfig");

  hooks.forEach((hook) => {
    if (packageJson.scripts[hook])
      Reflect.deleteProperty(packageJson.scripts, hook);
  });

  fs.writeFileSync(file_path, JSON.stringify(packageJson, null, 2));
}
