import HttpClient from './http-client';
import Error from './error';
import State from './state';
import Utils from './utils';
import Q from 'q';

class KidaptiveSdkModelManager {

  constructor() {
    //model hierarchy based on what models are used in each tier
    this.modelParents = {
      /*
      full: {
        'skills-framework': [],
        'skills-cluster': ['skills-framework'],
        'skills-domain': ['skills-cluster'],
        'dimension': ['skills-domain'],
        'game': [],
        'local-dimension': ['dimension', 'game'],
        'prompt': ['game'],
        'item': ['prompt', 'local-dimension'],
        'category': [],
        'sub-category': ['category'],
        'instance': ['sub-category'],
        'prompt-category': ['prompt', 'category', 'instance']   
      },
      */
      tier2: {
        'dimension': [],
        'game': [],
        'local-dimension': ['dimension', 'game']
      },
      tier3: {
        'dimension': [],
        'game': [],
        'local-dimension': ['dimension', 'game'],
        'item': ['local-dimension']
      }
    };

    //calculate order of model processing to process parents before children
    this.modelOrder = {}; 

    //build a model order for each tier (defined in modelParents)
    Object.keys(this.modelParents).forEach((tier) => {
      this.modelOrder[tier] = [];

      //build model order based on modelParents
      var determineModelOrder = (modelTypes) => {
          modelTypes.forEach((modelType) => {
              determineModelOrder(this.modelParents[tier][modelType]);
              if (this.modelOrder[tier].indexOf(modelType) === -1) {
                  this.modelOrder[tier].push(modelType);
              }
          });
      }
      determineModelOrder(Object.keys(this.modelParents[tier]));
    });
  }

  /**
   * Gets all game models
   * 
   * @return
   *   An array of game objects. If the model list is undefined, an empty array is returned.
   */
  getGames() {
    Utils.checkTier(2);
    //lookup model list
    const modelListLookup = State.get('modelListLookup', false) || {};
    const modelList = modelListLookup['game'] || [];
    //to copy array and objects before returning
    return Utils.copyObject(modelList);
  }

  /**
   * Gets the game by the provided URI
   *
   * @param {string} gameUri
   *   The gameUri of the game object that is to be returned
   * 
   * @return
   *   The game object. If no game is defined for that uri, then undefined is returned.
   */
  getGameByUri(gameUri) {
    Utils.checkTier(2);

    //validate gameUri
    if (!Utils.isString(gameUri)) {
      throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'gameUri must be a string');
    }

    //lookup model
    const uriToModel = State.get('uriToModel', false) || {};
    const modelMap = uriToModel['game'];
    const model =  modelMap && modelMap[gameUri];
    //copy object before returning
    return Utils.copyObject(model);
  }

  /**
   * Gets all dimension models
   * 
   * @return
   *   An array of dimension objects. If the model list is undefined, an empty array is returned.
   */
  getDimensions() {
    Utils.checkTier(2);
    //lookup model list
    const modelListLookup = State.get('modelListLookup', false) || {};
    const modelList = modelListLookup['dimension'] || [];
    //to copy array and objects before returning
    return Utils.copyObject(modelList);
  }

  /**
   * Gets the dimension by the provided URI
   *
   * @param {string} dimensionUri
   *   The dimensionUri of the dimension object that is to be returned
   * 
   * @return
   *   The dimension object. If no dimension is defined for that uri, then undefined is returned.
   */
  getDimensionByUri(dimensionUri) {
    Utils.checkTier(2);

    //validate dimensionUri
    if (!Utils.isString(dimensionUri)) {
      throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'dimensionUri must be a string');
    }
    
    //lookup model
    const uriToModel = State.get('uriToModel', false) || {};
    const modelMap = uriToModel['dimension'];
    const model =  modelMap && modelMap[dimensionUri];
    //copy object before returning
    return Utils.copyObject(model);
  }

  /**
   * Gets all local dimension models
   * 
   * @return
   *   An array of local dimension objects. If the model list is undefined, an empty array is returned.
   */
  getLocalDimensions() {
    Utils.checkTier(2);
    //lookup model list
    const modelListLookup = State.get('modelListLookup', false) || {};
    const modelList = modelListLookup['local-dimension'] || [];
    //copy array and objects before returning
    return Utils.copyObject(modelList);
  }

  /**
   * Gets the local dimension by the provided URI
   *
   * @param {string} localDimensionUri
   *   The localDimensionUri of the local dimension object that is to be returned
   * 
   * @return
   *   The local dimension object. If no local dimension is defined for that uri, then undefined is returned.
   */
  getLocalDimensionByUri(localDimensionUri) {
    Utils.checkTier(2);

    //validate localDimensionUri
    if (!Utils.isString(localDimensionUri)) {
      throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'localDimensionUri must be a string');
    }
    
    //lookup model
    const uriToModel = State.get('uriToModel', false) || {};
    const modelMap = uriToModel['local-dimension'];
    const model =  modelMap && modelMap[localDimensionUri];
    //copy object before returning
    return Utils.copyObject(model);
  }

  /**
   * Gets all local item models
   * 
   * @return
   *   An array of item objects. If the model list is undefined, an empty array is returned.
   */
  getItems() {
    Utils.checkTier(3);
    //lookup model list
    const modelListLookup = State.get('modelListLookup', false) || {};
    const modelList = modelListLookup['item'] || [];
    //copy array and objects before returning
    return Utils.copyObject(modelList);
  }

  /**
   * Gets the item by the provided URI
   *
   * @param {string} itemUri
   *   The itemUri of the item object that is to be returned
   * 
   * @return
   *   The item object. If no item is defined for that uri, then undefined is returned.
   */
  getItemByUri(itemUri) {
    Utils.checkTier(3);

    //validate itemUri
    if (!Utils.isString(itemUri)) {
      throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'itemUri must be a string');
    }
    
    //lookup model
    const uriToModel = State.get('uriToModel', false) || {};
    const modelMap = uriToModel['item'];
    const model =  modelMap && modelMap[itemUri];
    //copy object before returning
    return Utils.copyObject(model);
  }

  /**
   * Updates the mdoels for the given tier
   * 
   * @return
   *   A promise that resolves when the models have all been requested and stored
   */
  updateModels() {
    Utils.checkTier(2);

    //reset previous models
    State.set('uriToModel', {});
    State.set('idToModel', {});
    State.set('modelListLookup', {});

    //setup reference variables
    const options = State.get('options') || {};
    const tierKey = 'tier' + options.tier;
    const modelOrder = this.modelOrder[tierKey];
    const modelParents = this.modelParents[tierKey];

    //api calls to get models
    const requests = modelOrder.map(model => {
      return HttpClient.request('GET', '/' + model);
    });

    //when all api calls complete
    return Q.all(requests).then(results => {

      //setup objects used for storing id/uri maps for all models
      const uriToModel = {};
      const idToModel = {};
      const modelListLookup = {};

      //loop through results
      for (let i = 0; i < results.length; i++) {
        //get model name from modelOrder
        const modelName = modelOrder[i];

        //setup objects used for storing id/uri maps for model
        const modelUriMap = {};
        const modelIdMap = {};
        const modelList = [];

        //loop through results
        const modelArray = results[i] || [];
        modelArray.forEach(model => {

          //create copy of model
          const modelCopy = Utils.copyObject(model);

          //append parents to model using modelParents
          modelParents[modelName].forEach(modelParentName => {
            //transforme model parent name removing - and camelCase
            const publicModelParentName = modelParentName.replace(/-([a-z])/g, matched => matched[1].toUpperCase());

            //get modelParentId from model
            const modelParentId = modelCopy[publicModelParentName + 'Id'];

            //place modelParent object
            const idToModel = State.get('idToModel', false) || {};
            modelCopy[publicModelParentName] = idToModel[modelParentName] && idToModel[modelParentName][modelParentId];

            //delete original ID property since it will be contained in parent object
            delete modelCopy[publicModelParentName + 'Id'];
          });

          //build id/uri maps to optimize lookups
          modelUriMap[modelCopy.uri] = modelCopy;
          modelIdMap[modelCopy.id] = modelCopy;
          modelList.push(modelCopy);
        });

        //store model lookups in objects that contain all models
        uriToModel[modelName] = modelUriMap;
        idToModel[modelName] = modelIdMap;
        modelListLookup[modelName] = modelList;

        //store model id/uri maps and lists
        State.set('uriToModel', uriToModel, false);
        State.set('idToModel', idToModel, false);
        State.set('modelListLookup', modelListLookup, false);
      }

    //return first error
    }, error => {
      throw error;
    });
  }

}

export default new KidaptiveSdkModelManager();
