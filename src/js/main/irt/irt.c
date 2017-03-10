//
//  kidaptive_irt.c
//  kidaptivesdk
//
//  Created by Solomon Liu on 6/20/16.
//  Copyright © 2016 Chris Novak. All rights reserved.
//

#include "irt.h"
#include <math.h>
#include <float.h>
#include <stdio.h>

double normal_dist(double x, double mu, double sigma) {
    return exp(-pow(x - mu, 2) / 2 / pow(sigma, 2)) / sigma / sqrt(2 * M_PI);
}

double logistic_dist(double x, double mu, double alpha) {
    return 1.0 / (1.0 + exp(-alpha * (x - mu)));
}

//for figuring out difficulty of item based on proportion of learners who get item correct
//p: proportion of learners correct
//returns value that can be used as beta
double inv_logis(double p) {
	return log(1 / p - 1) * sqrt(M_PI / 8);
}

//INPUT
//y: whether or not item was answered correctly
//beta: difficulty of the item (look up by item_id) typically [-4,4] tested between [-10, 10] should handle any values
//theta: ability estimate mean for learner (looked up by learner_id) ranges same as beta
//sigma: ability estimate standard deviation (looked up by learner_id) typically between (0, 1] tested between [.1, 1] should handle any values
//OUTPUT
//post_mean: posterior ability estimate mean, can be used as theta for next response
//post_sd: posterior ability estimate sd, can be used as sigma for next response
void estimate (double y, double beta, double guessing, double theta, double sigma, double *post_mean, double *post_sd) {
    double a = sqrt(8 / M_PI); //item discrimination. fixed value to approximate normal CDF
	double max_sigma = 2 / a; //maximum value of sigma which is guaranteed to produce a unimodal posterior.

    *post_mean = theta;
    *post_sd = sigma = fmin(fmax(sigma,0), max_sigma);

    if (sigma == 0) {
		return; //no uncertainty in prior.
	}

    y = fmin(fmax(y, 0), 1);

    if (guessing >= 1) {
    	return; //no information because impossible to get wrong.
    } else {
    	guessing = fmax(guessing, 0);
    }

    double dll; //first derivative of log likelihood; dll=0 corresponds to maximum.
    double ddll; //second derivative of log likelihood
    double x; //last value of post_mean. use as exit condition
    double high = INFINITY; //upper bound for binomial search
    double low = -INFINITY; //lower bound for binomial search
    double delta = 1; //step size for infinite bounds;
    double p;
    double q;
    double P;

    do {
    	x = *post_mean;
    	p = logistic_dist(*post_mean, beta, a);
    	q = 1 - p;
    	if (y == 0 || guessing == 0) {
    		dll = a * (y - p) - (*post_mean - theta) * pow(sigma, -2);
    		ddll = -pow(a, 2) * p * q - pow(sigma, -2);
    	} else {
    		P = guessing + (1 - guessing) * p;
    		dll = a * p * (y - P) / P - (*post_mean - theta) * pow(sigma, -2);
    		ddll = pow(a, 2) * p * q * (guessing * y - pow(P, 2)) * pow(P, -2) - pow(sigma, -2);
    	}

		//restrict search boundaries
    	if (dll > 0) {
    		low = *post_mean;
    	} else if (dll < 0) {
    		high = *post_mean;
    	}

    	*post_mean -= dll/ddll; //Newton-Raphson Method

		//If N-R method produces a point outside the known search boundaries, use binomial search.
    	if (*post_mean >= high || *post_mean <= low) {
    		if (high < INFINITY && low > -INFINITY) {
    			*post_mean = (high + low) / 2;
    		} else if (high < INFINITY) {
    			*post_mean -= delta;
    			delta *= 2;
    		} else {
    			*post_mean += delta;
    			delta *= 2;
    		}
    	}
    } while (x != *post_mean);

    *post_sd = fmin(sqrt(-1 / ddll), max_sigma);
}
