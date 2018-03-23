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
void estimate (bool y, double beta, double theta, double sigma, double *post_mean, double *post_sd) {
	if (sigma == 0) {
		*post_mean = theta;
		*post_sd = sigma;
		return;
	}
    double x = theta; //posterior mean, current estimate
    double s1 = 0.0; //posterior SD left, current estimate
    double s2 = 0.0; //posterior SD right, current estimate
    double x_new = theta; //temporary variable for next posterior mean estimate
    double a = sqrt(8 / M_PI); //item discrimination, set to this value to approximat normal CDF
    
    double delta = 1.0; //step size for unbounded search
    double max = 0.0; //density at mode, current estimate
    double upper = INFINITY; //lower bound for search
    double lower = -INFINITY; //upper bound for search
    
    double phi = 0.0; //normal PDF
    double g = 0.0; //logistic CDF
    
    double y0 = 0.0; //phi * g
    double y1 = 0.0; //first derivative of y0
    double y1sign0 = 0.0; //sign term for y1: a(1 - g) - (x - theta) / sigma^2
    double y1sign1 = 0.0; //first derivative of y1sign0
    
    double sd_ratio = exp(-0.5); //ratio of density of normal distribution at (1 SD away from mean) / mean
    
    if (!y) {
        a = -a; //reverse the sign of alpha if outcome is false
    }
    
    while (true) {
        //calculate posterior density and derivatives
        phi = normal_dist(x, theta, sigma);
        g = logistic_dist(x, beta, a);
        y0 = phi * g;
        y1sign0 = (a * (1 - g) - (x - theta) / pow(sigma,2)); //<- function we are trying to zero
        y1sign1 = -pow(a,2) * g * (1 - g) - 1 / pow(sigma, 2);
        
        //update maximum density
        if (y0 > max) {
            max = y0;
        }
        
        //update limits
        if (fabs(y1sign0) < 1e-6) { //completion criterion;
            break;
        } else if (y1sign0 > 0) {
            lower = x;
        } else if (y1sign0 < 0) {
            upper = x;
        }
        
        x_new = x - y1sign0 / y1sign1; //Newton-Raphson method for finding zero
        if (x_new > lower && x_new < upper) { //NR worked, go to next iteration
            x = x_new;
            continue;
        }
        
        //NR did not work, fall back on binomial search
        if (lower > -INFINITY && upper < INFINITY) { //bounded search between finite lower and upper bounds
            x_new = (upper + lower) / 2;
        } else if (lower == -INFINITY) { //unbounded search for lower bound
            x_new = x - delta;
            delta = delta * 2;
        } else { //unbounded search for upper bound
            x_new = x + delta;
            delta = delta * 2;
        }
        
        x = x_new;
    }
    
    max = normal_dist(x, theta, sigma) * logistic_dist(x, beta, a); //just in case this was never set
    
    //lower SD approximation
    s1 = x - sigma; //start looking 1 SD away from posterior mean estimate
    //reset unbounded search step size and bounds
    delta = 1;
    lower = -INFINITY;
    upper = x;
    
    while (true) {
        phi = normal_dist(s1, theta, sigma);
        g = logistic_dist(s1, beta, a);
        y0 = phi * g;
        y1 = y0 * (a * (1 - g) - (s1 - theta) / pow(sigma,2));
        y0 = y0 - sd_ratio * max;
        
        //update limits
        if (fabs(y0) < max * 1e-6) {
            break;
        } else if (y0 < 0) {
            lower = s1;
        } else {
            upper = s1;
        }
        
        x_new = s1 - y0/y1;
        if (x_new > lower && x_new < upper) { //NR worked, go to next iteration
            s1 = x_new;
            continue;
        }
        
        //NR did not work, fall back on binomial search
        if (lower > -INFINITY && upper < INFINITY) {
            x_new = (upper + lower) / 2;
        } else if (lower == -INFINITY) {
            x_new = s1 - delta;
            delta = delta * 2;
        } else {
            x_new = s1 + delta;
            delta = delta * 2;
        }
        
        s1 = x_new;
    }
    
    //upper SD approximation
    s2 = x + sigma;
    delta = 1;
    lower = x;
    upper = INFINITY;
    
    while (true) {
        phi = normal_dist(s2, theta, sigma);
        g = logistic_dist(s2, beta, a);
        y0 = phi * g;
        y1 = y0 * (a * (1 - g) - (s2 - theta) / pow(sigma,2));
        y0 = y0 - sd_ratio * max;
        
        //update limits
        if (fabs(y0) < max * 1e-6) {
            break;
        } else if (y0 > 0) {
            lower = s2;
        } else {
            upper = s2;
        }
        
        x_new = s2 - y0/y1;
        if (x_new > lower && x_new < upper) { //NR worked, go to next iteration
            s2 = x_new;
            continue;
        }
        
        //NR did not work, fall back on binomial search
        if (lower > -INFINITY && upper < INFINITY) {
            x_new = (upper + lower) / 2;
        } else if (lower == -INFINITY) {
            x_new = s2 - delta;
            delta = delta * 2;
        } else {
            x_new = s2 + delta;
            delta = delta * 2;
        }
        
        s2 = x_new;
    }
    
    double postSigma1 = (x - s1);
    double postSigma2 = (s2 - x);
    *post_mean = x + sqrt(2 / M_PI) * (postSigma2 - postSigma1); //shift mean weighted by SD estimates
    *post_sd = sqrt((pow(postSigma1,3) + pow(postSigma2, 3))  / (postSigma1 + postSigma2) - 2 * pow(postSigma2 - postSigma1, 2) / M_PI); //recalculate SD
}
