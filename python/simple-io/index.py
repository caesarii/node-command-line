import sys
from time import ctime

def main():
  stdin = sys.stdin
  stdout = sys.stdout

  while True:
    data = stdin.readline()
    if not data:
      print('not data')
    res = '{0}: {1}'.format(ctime(), data)
    stdout.write(res)
main()