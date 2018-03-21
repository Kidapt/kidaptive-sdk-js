//
//  kidaptive_irt.h
//  kidaptivesdk
//
//  Created by Solomon Liu on 6/20/16.
//  Copyright © 2016 Chris Novak. All rights reserved.
//

#ifndef kidaptive_irt_h
#define kidaptive_irt_h

#include <stdbool.h>

double normal_dist(double x, double mu, double sigma);
double logistic_dist(double x, double mu, double alpha);
double inv_logis(double p);
void estimate (bool outcome, double difficulty, double prior_mean, double prior_sd, double *post_mean, double *post_sd);

#endif /* kidaptive_irt_h */
