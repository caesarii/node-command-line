import numpy as np
import matplotlib .pylab as plt

def step_function(x):
  return np.array(x > 0, dtype = np.int32)


def draw_step():
  x = np.arange(-5.0, 5.0, 0.1)
  y = step_function(x)

  plt.plot(x, y)
  plt.ylim(-0.1, 1.1)
  plt.show()


def sigmoid(x):
  return 1 / ( 1 + np.exp(-x))

def draw_sigmoid():
  x = np.arange(-5.0, 5.0, 0.1)
  y = sigmoid(x)

  plt.plot(x, y)
  plt.ylim(-0.1, 1.1)
  plt.show()




def relu(x):
  return np.maximum(0, x)

def draw_relu():
  x = np.arange(-5.0, 5.0, 0.1)
  y = relu(x)

  plt.plot(x, y)
  plt.ylim(-1, 6)
  plt.show()


def softmax(a):
  c = np.max(a)

  expa = np.exp(a - c)

  sum_expa = np.sum(expa)

  y  = expa / sum_expa

  return y


def draw_softmax():
  x = np.arange(-10.0, 10.0, 0.1)
  y = softmax(x)

  plt.plot(x, y)
  plt.show()



if __name__ == "__main__":
  # draw_step()

  # draw_sigmoid()

  # draw_relu()


  # draw_softmax()

  print(softmax(np.array([0.3, 2.9, 4.0])))