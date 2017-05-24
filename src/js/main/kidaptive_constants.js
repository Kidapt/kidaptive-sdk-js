/**
 * Created by solomonliu on 2017-05-23.
 */
"use strict";
module.exports = {
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
        INGESTION:"/ingestion",

        USER:"/user/me",
        LOGOUT:"/user/logout"
    },

    ALP_EVENT_VERSION:"3.0",

    LOCAL_STORAGE: {
        API_KEY: "kidaptive.api_key",
        APP: "kidaptive.app"
    }
};