/**
 * Interface for defining custom logic for IRT handling. The methods defined
 * by this interface are generally used to override initial values for ability
 * estimates when no prior data for that learner is available.
 * 
 * All of the methods defined in this interface are optional.
 * 
 * @interface IRTExtension
 */

/**
 * Obtain a default local ability estimate for a particular local dimension. The default estimate
 * is used as a starting point in situations where no previous measurement of a learner's local ablity has occurred.
 * 
 * @function IRTExtension#getInitialLocalAbilityEstimate
 * @param {string} localDimensionUri URI of the local dimension for which an initial estimate is needed.
 * @returns {module:types/irt-extension~AbilityEstimate} An object representing a default local ability estimate for the specified local dimension.
 */

/**
 * When the learner starts a new trial, the SDK  will call this method to reset the
 * ability estimate. A common scenario (implemented with the SDK as a default) is to decrease the 
 * confidence in the estimate by increasing the standard deviation parameter.
 * 
 * @function IRTExtension#resetLocalAbilityEstimate
 * @param {module:types/irt-extension~AbilityEstimate} localAbilityEstimate The ability estimate to update. This object should not be mutated by the function.
 * @returns {module:types/irt-extension~AbilityEstimate} An object representing a updated local ability estimate. 
 */

/**
 * Obtain a default latent ability estimate for a particular dimension. The default estimate
 * is used as a starting point in situations where no previous measurement of a learner's ablity has occurred.
 * 
 * @function IRTExtension#getInitialLatentAbilityEstimate
 * @param {string} dimensionUri URI of the dimension for which an initial estimate is needed.
 * @returns {module:types/irt-extension~AbilityEstimate} An object representing a default latent ability estimate for the specified dimension.
 */

/**
 * When the learner starts a new trial, the SDK will call this method to reset the
 * ability estimate. A common scenario (implemented with the SDK as a default) is to decrease the 
 * confidence in the estimate by increasing the standard deviation parameter.
 * 
 * @function IRTExtension#resetLatentAbilityEstimate
 * @param {module:types/irt-extension~AbilityEstimate} latentAbilityEstimate The ability estimate to update. This object should not be mutated by the function.
 * @returns {module:types/irt-extension~AbilityEstimate} An object representing a updated latent ability estimate. 
 */

 /**
  * @module types/irt-extension
  */

  /**
   * @typedef {object} AbilityEstimate
   * @property {number} mean ability estimate value
   * @property {number} standardDeviation standard deviation (uncertainty) for the estimate value
   * @property {number} timestamp timestamp at which the estimate was determined.
   */