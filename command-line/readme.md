一个可以去读JSON文件的命令行工具DEMO

echo "[1,2,3]" |node  parse-json.js -f test.json -g

echo "[1,2,3]" |node  parse-json.js -f - -g
输入文件名