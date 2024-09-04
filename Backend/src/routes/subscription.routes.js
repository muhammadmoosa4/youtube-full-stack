import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// router.route().get(getSubscribedChannels)

router.route("/channel/:channelName").post(toggleSubscription);

router.route("/u/:channelName").get(getUserChannelSubscribers);


router.route("/e/:channelName").get(getSubscribedChannels)

export default router