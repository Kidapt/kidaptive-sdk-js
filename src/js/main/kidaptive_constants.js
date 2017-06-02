/**
 * Created by solomonliu on 2017-05-23.
 */
"use strict";
var KidaptiveConstants = {
    HOST_PROD:"https://service.kidaptive.com/v3",
    HOST_DEV:"https://develop.kidaptive.com/v3",

    ENDPOINTS: {
        APP:"/app/me",
        GAME:"/game",
        PROMPT:"/prompt",
        CATEGORY:"/category",
        SUB_CATEGORY:"/sub-category",
        INSTANCE:"/instance",
        PROMPT_CATEGORY:"/prompt-category",
        SKILLS_FRAMEWORK:"/skills-framework",
        SKILLS_CLUSTER:"/skills-cluster",
        SKILLS_DOMAIN:"/skills-domain",
        DIMENSION:"/dimension",
        LOCAL_DIMENSION:"/local-dimension",
        ITEM:"/item",

        LEARNER:"/learner",
        ABILITY:"/ability",
        LOCAL_ABILITY:"/local-ability",
        INSIGHT:"/insight",
        INGESTION:"/ingestion",

        USER:"/user/me",
        LOGOUT:"/user/logout"
    },

    ALP_EVENT_VERSION:"3.0",

    HTTP_CACHE_PREFIX:'kidaptive.sdk.http.cache'
};