/**
 * Created by solomonliu on 7/8/16.
 */

class KidaptiveConstants {
    static SWAGGER_HOST = "develop.kidaptive.com";
    static SWAGGER_SCHEMES = ["https"];

    static HOST_PROD = "https://service.kidaptive.com/v3";
    static HOST_DEV = "https://develop.kidaptive.com/v3";

    static APP = "/app/me";
    static GAME = "/game";
    static PROMPT = "/prompt";
    static CATEGORY = "/category";
    static SUB_CATEGORY = "/sub-category";
    static INSTANCE = "/instance";
    static PROMPT_CATEGORY = "/prompt-category";
    static SKILLS_FRAMEWORK = "/skills-framework";
    static SKILLS_CLUSTER = "/skills-cluster";
    static SKILLS_DOMAIN = "/skills-domain";
    static DIMENSION = "/dimension";
    static LOCAL_DIMENSION = "/local-dimension";
    static ITEM = "/item";

    static LEARNER = "/learner";
    static ABILITY = "/ability";
    static LOCAL_ABILITY = "/local-ability";
    static INGESTION = "/ingestion";

    static USER = "/user/me";
    static LOGOUT = "/user/logout";

    static ALP_EVENT_VERSION = "3.0"
}

export {KidaptiveConstants};