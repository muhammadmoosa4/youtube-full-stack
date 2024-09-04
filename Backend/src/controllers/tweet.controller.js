import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    // Validate the tweet content
    if (!content) {
        throw new ApiError(400, "Tweet content is required");
    }

    // Create the tweet
    let tweet = await Tweet.create({
        content,
        owner: req.user._id,
    });

    if (!tweet) {
        throw new ApiError(500, "Error while creating tweet");
    }

    // Populate the owner field to include the whole user data
    tweet = await Tweet.findById(tweet._id).populate('owner');

    // Respond with the created tweet, including user details
    res.status(200).json(new ApiResponse(200, { tweet }, "Tweet created successfully"));
});
const getUserTweets = asyncHandler(async (req, res) => {
    // Fetch all tweets for the currently authenticated user
    const tweets = await Tweet.find({ owner: req.user._id }).populate('owner');

    // Check if no tweets were found for the user
    if (!tweets.length) {
        throw new ApiError(404, "No tweets found for this user");
    }

    // Respond with the user's tweets
    res.status(200).json(new ApiResponse(200, { tweets }, "User's tweets retrieved successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    // Validate if the content to update is provided
    if (!content) {
        throw new ApiError(400, "Details that you want to update are required.");
    }

    // Update the tweet by its ID
    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        { $set: { content } },
        { new: true, runValidators: true }
    );

    // Check if the tweet exists
    if (!tweet) {
        throw new ApiError(404, "Tweet does not exist.");
    }

    // Return the updated tweet
    res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully."));
});
const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    if (!deletedTweet) {
        throw new ApiError(400 , "tweet does not exist")
    }


    res.status(200)
    .json(new ApiResponse(200 , {deletedTweet} , "tweet is deleted") )

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
