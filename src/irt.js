class KidaptiveSdkIrt {

  estimate(y, beta, theta, sigma, post_mean, post_sd) {
    return KidaptiveSdkIrt.estimate(y || 0, beta || 0, theta || 0, sigma || 0, post_mean || 0, post_sd || 0);
  }

  static normal_dist(x, mu, sigma) {
    return Math.exp(-Math.pow(x - mu, 2) / 2 / Math.pow(sigma, 2)) / sigma / Math.sqrt(2 * Math.PI);
  }

  static logistic_dist(x, mu, alpha) {
    return 1 / (1 + Math.exp(-alpha * (x - mu)));
  }

  static inv_logis(p) {
      return Math.log(1 / p - 1) * Math.sqrt(Math.PI / 8);
  }

  static estimate(y, beta, theta, sigma, post_mean, post_sd) {
    if (sigma === 0) {
      post_mean = theta;
      post_sd = sigma;
      return {
        post_mean: post_mean,
        post_sd: post_sd
      };
    }
    var x = theta;
    var s1 = 0;
    var s2 = 0;
    var x_new = theta;
    var a = Math.sqrt(8 / Math.PI);
    var delta = 1;
    var max = 0;
    var upper = Infinity;
    var lower = -Infinity;
    var phi = 0;
    var g = 0;
    var y0 = 0;
    var y1 = 0;
    var y1sign0 = 0;
    var y1sign1 = 0;
    var sd_ratio = Math.exp(-.5);
    if (!y) {
      a = -a;
    }
    while (true) {
      phi = KidaptiveSdkIrt.normal_dist(x, theta, sigma);
      g = KidaptiveSdkIrt.logistic_dist(x, beta, a);
      y0 = phi * g;
      y1sign0 = a * (1 - g) - (x - theta) / Math.pow(sigma, 2);
      y1sign1 = -Math.pow(a, 2) * g * (1 - g) - 1 / Math.pow(sigma, 2);
      if (y0 > max) {
          max = y0;
      }
      if (Math.abs(y1sign0) < 1e-6) {
          break;
      } else if (y1sign0 > 0) {
          lower = x;
      } else if (y1sign0 < 0) {
          upper = x;
      }
      x_new = x - y1sign0 / y1sign1;
      if (x_new > lower && x_new < upper) {
          x = x_new;
          continue;
      }
      if (lower > -Infinity && upper < Infinity) {
          x_new = (upper + lower) / 2;
      } else if (lower === -Infinity) {
          x_new = x - delta;
          delta = delta * 2;
      } else {
          x_new = x + delta;
          delta = delta * 2;
      }
      x = x_new;
    }
    max = KidaptiveSdkIrt.normal_dist(x, theta, sigma) * KidaptiveSdkIrt.logistic_dist(x, beta, a);
    s1 = x - sigma;
    delta = 1;
    lower = -Infinity;
    upper = x;
    while (true) {
      phi = KidaptiveSdkIrt.normal_dist(s1, theta, sigma);
      g = KidaptiveSdkIrt.logistic_dist(s1, beta, a);
      y0 = phi * g;
      y1 = y0 * (a * (1 - g) - (s1 - theta) / Math.pow(sigma, 2));
      y0 = y0 - sd_ratio * max;
      if (Math.abs(y0) < max * 1e-6) {
        break;
      } else if (y0 < 0) {
        lower = s1;
      } else {
        upper = s1;
      }
      x_new = s1 - y0 / y1;
      if (x_new > lower && x_new < upper) {
        s1 = x_new;
        continue;
      }
      if (lower > -Infinity && upper < Infinity) {
        x_new = (upper + lower) / 2;
      } else if (lower === -Infinity) {
        x_new = s1 - delta;
        delta = delta * 2;
      } else {
        x_new = s1 + delta;
        delta = delta * 2;
      }
      s1 = x_new;
    }
    s2 = x + sigma;
    delta = 1;
    lower = x;
    upper = Infinity;
    while (true) {
      phi = KidaptiveSdkIrt.normal_dist(s2, theta, sigma);
      g = KidaptiveSdkIrt.logistic_dist(s2, beta, a);
      y0 = phi * g;
      y1 = y0 * (a * (1 - g) - (s2 - theta) / Math.pow(sigma, 2));
      y0 = y0 - sd_ratio * max;
      if (Math.abs(y0) < max * 1e-6) {
        break;
      } else if (y0 > 0) {
        lower = s2;
      } else {
        upper = s2;
      }
      x_new = s2 - y0 / y1;
      if (x_new > lower && x_new < upper) {
        s2 = x_new;
        continue;
      }
      if (lower > -Infinity && upper < Infinity) {
        x_new = (upper + lower) / 2;
      } else if (lower === -Infinity) {
        x_new = s2 - delta;
        delta = delta * 2;
      } else {
        x_new = s2 + delta;
        delta = delta * 2;
      }
      s2 = x_new;
    }
    var postSigma1 = x - s1;
    var postSigma2 = s2 - x;
    post_mean = x + Math.sqrt(2 / Math.PI) * (postSigma2 - postSigma1);
    post_sd = Math.sqrt((Math.pow(postSigma1, 3) + Math.pow(postSigma2, 3)) / (postSigma1 + postSigma2) - 2 * Math.pow(postSigma2 - postSigma1, 2) / Math.PI);
    return {
      post_mean: post_mean,
      post_sd: post_sd
    };
  }

}

export default new KidaptiveSdkIrt();
