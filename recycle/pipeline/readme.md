pipeline 演示 DEMO

case1: 
echo "[1,2,3]" |node  parse-json.js -f - -g

case2:
node parse-json.js -f test.json -g | node time.js