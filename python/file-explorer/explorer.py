import traceback
import sys
import os

config = {
  'currentDir': ''
}

def listDir(dir, space):
  if os.path.exists(dir):
    files = os.listdir(dir)

    for (i, file) in enumerate(files):
      filePath = dir + '/' + file
      if os.path.isdir(filePath):
        print('{0}{1}: {2}: D'.format(space, i, file))
      else:
        print('{0}{1}: {2}: F'.format(space, i, file))
  else: 
    print('目录 ' + dir + ' 不存在')


def ls(path, space = ''):
  realPath = os.getcwd() + '/' + path
 
  if os.path.isdir(realPath):
    config['currentDir'] = path
    listDir(realPath, space)
  else:
    if os.path.exists(realPath):
      content = open(realPath, 'r')
      sys.stdout.write(content.read())
    else:
       print('文件 ' + realPath + ' 不存在')

  handleInput()

def handleInput():
  sys.stdout.write('\r\nPlease enter your choice: \n\n')
  input = ''
  while True:
    input = sys.stdin.readline().strip()
    if input:
      break

  p = '{0}/{1}'.format(config['currentDir'], input)  
  ls(p)

def explorer():
  try:
    dir = sys.argv[1]
    ls(dir)
  except:
    print(traceback.format_exec())

def __main():
  # python3 explorer.py test
  explorer()

__main()
