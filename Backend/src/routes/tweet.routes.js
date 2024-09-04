import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/createTweet").post(createTweet);
router.route("/getusertweets").get(getUserTweets);
router.route("/tweets/:tweetId").patch(updateTweet); // Update a tweet by ID
router.route("/deleteTweet/:tweetId").delete(deleteTweet);

export default router