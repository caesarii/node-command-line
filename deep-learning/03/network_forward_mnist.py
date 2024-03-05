import sys, os
sys.path.append(os.pardir)
from dataset.mnist import load_mnist
import numpy as np
from PIL import Image
import activation as ac
import pickle

def img_show(img):
  pil_img = Image.fromarray(np.uint8(img))
  pil_img.show()

def get_data():
  (x_train, t_train), (x_test, t_test) = load_mnist(flatten = True, normalize = False, one_hot_label = False)
  print(x_train.shape)
  print(t_train.shape)
  print(x_test.shape)
  print(t_test.shape)
  return x_test, t_test

def init_network():
  with open('sample_weight.pkl', 'rb') as f:
    network = pickle.load(f)
  return network

def predict(network, x):
  W1, W2, W3 = network['W1'], network['W2'], network['W3']
  b1, b2, b3 = network['b1'], network['b2'], network['b3']

  a1 = np.dot(x, W1) + b1
  z1 = ac.sigmoid(a1)

  a2 = np.dot(z1, W2) + b2
  z2 = ac.sigmoid(a2)

  a3 = np.dot(z2, W3) + b3
  y = ac.softmax(a3)

  return y


if __name__ == '__main__':
  x, t = get_data()
  network = init_network()

  accuracy_cnt = 0
  for i in range(len(x)):
    y = predict(network, x[i])
    p = np.argmax(y)
    if p == t[i]:
      accuracy_cnt += 1
  print('Accuracy:' + str(float(accuracy_cnt)/ len(x)))

# img = x_train[0]
# label = t_train[0]
# print(label)

# print(img.shape)
# img = img.reshape(28, 28)

# print(img.shape)

# img_show(img)

