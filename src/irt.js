class KidaptiveSdkIrt {

  estimate(y, beta, guessing, theta, sigma, post_mean, post_sd) {
    return KidaptiveSdkIrt.estimate(y || 0, beta || 0, guessing || 0, theta || 0, sigma || 0, post_mean || 0, post_sd || 0);
  }

  static normal_dist(x, mu, sigma) {
    return Math.exp(-Math.pow(x - mu, 2) / 2 / Math.pow(sigma, 2)) / sigma / Math.sqrt(2 * Math.PI);
  }

  static logistic_dist(x, mu, alpha) {
    return 1.0 / (1.0 + Math.exp(-alpha * (x - mu)));
  }

  static inv_logis(p) {
    return Math.log(1 / p - 1) * Math.sqrt(Math.PI / 8);
  }

  static estimate(y, beta, guessing, theta, sigma, post_mean, post_sd) {
    let a = Math.sqrt(8 / Math.PI);
    let max_sigma = 2 / a;
    post_mean = theta;
    post_sd = sigma = Math.min(Math.max(sigma, 0), max_sigma);
    if (sigma === 0) {
        return {post_mean: post_mean, post_sd: post_sd};
    }
    y = Math.min(Math.max(y, 0), 1);
    if (guessing >= 1) {
        return {post_mean: post_mean, post_sd: post_sd};
    } else {
        guessing = Math.max(guessing, 0);
    }
    let dll;
    let ddll;
    let x;
    let high = Infinity;
    let low = -Infinity;
    let delta = 1;
    let p;
    let q;
    let P;
    do {
      x = post_mean;
      p = KidaptiveSdkIrt.logistic_dist(post_mean, beta, a);
      q = 1 - p;
      if (y === 0 || guessing === 0) {
        dll = a * (y - p) - (post_mean - theta) * Math.pow(sigma, -2);
        ddll = -Math.pow(a, 2) * p * q - Math.pow(sigma, -2);
      } else {
        P = guessing + (1 - guessing) * p;
        dll = a * p * (y - P) / P - (post_mean - theta) * Math.pow(sigma, -2);
        ddll = Math.pow(a, 2) * p * q * (guessing * y - Math.pow(P, 2)) * Math.pow(P, -2) - Math.pow(sigma, -2);
      }
      if (dll > 0) {
        low = post_mean;
      } else if (dll < 0) {
        high = post_mean;
      }
      post_mean -= dll / ddll;
      if (post_mean >= high || post_mean <= low
      ) {
        if (high < Infinity && low > -Infinity) {
          post_mean = (high + low) / 2;
        } else if (high < Infinity) {
          post_mean -= delta;
          delta *= 2;
        } else {
          post_mean += delta;
          delta *= 2;
        }
      }
    } while (x !== post_mean);
    post_sd = Math.min(Math.sqrt(-1 / ddll), max_sigma);
    return {post_mean: post_mean, post_sd: post_sd}
  }

}

export default new KidaptiveSdkIrt();
