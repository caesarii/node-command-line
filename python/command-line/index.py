import sys

def parse(file):
  return open(file, 'r').read()

#  以形如 '-f'的处理为选项, 非 - 开头的处理为参数, '-'作为特殊参数
def parseArgs(args):
  options = args[1:]
  obj = {}
  i = 0
  while i < len(options):
    curr = options[i]
    if curr.startswith('-'):
      obj[curr[1:]] = options[i + 1]
      i += 2
    else:
      print('args format is wrong')
  return obj


def __main():
  args = sys.argv
  print(args)
  parsedArgs = parseArgs(args)
 
  print(
    args, 
    parsedArgs
  )

  file = parsedArgs['f']

  if not file:
    print('-f 参数是必须的')

  #  从命令行接受参数
  stdin = sys.stdin
  if file == '-': 
    sys.stdout.write('请输入正确的文件路径:' + "\r\n")
    params = stdin.readline().strip('\r\n')
   
    if not params.endswith('.json'):
      sys.stdout.write('请输入正确的文件路径:' + "\r\n")
    
    content = parse(params)
    print('file content:\r\n {0}'.format(content))

  else:
    content = parse(file)
    print('file content:\r\n {0}'.format(content))

__main()