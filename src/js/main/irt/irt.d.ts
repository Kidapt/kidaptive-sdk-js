/**
 * Created by solomonliu on 8/11/16.
 */

declare function _estimate(y:boolean, beta:number, priorMean:number, priorSd:number, postMean:number, postSd:number):void;
declare function _malloc(size:number):number;
declare function getValue(pointer:number, type:string):any;
declare function _free(point:number):void;

export {_estimate, _malloc, getValue, _free};