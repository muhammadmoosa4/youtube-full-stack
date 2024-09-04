import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from '..//models/video.model.js'
import { Comment } from '..//models/comment.model.js'
import { Tweet } from "../models/tweet.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const likeIndex = video.likes.indexOf(userId);

    if (likeIndex === -1) {

        video.likes.push(userId);
        video.likesCount += 1; 
    } else {

        video.likes.splice(likeIndex, 1);
        video.likesCount -= 1; 
    }

 
    await video.save();


    res.status(200).json(new ApiResponse(200, { video }, "Video like toggled successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id; // Assuming user ID is available in req.user

    // Check if the comment exists
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Initialize likes array if it is not defined
    if (!comment.likes) {
        comment.likes = [];
    }

    // Check if the user has already liked the comment
    const likeIndex = comment.likes.indexOf(userId);

    if (likeIndex === -1) {
        // User hasn't liked the comment yet, so add the like
        comment.likes.push(userId);
        comment.likesCount = (comment.likesCount || 0) + 1; // Increment like count, default to 0 if undefined
    } else {
        // User has already liked the comment, so remove the like
        comment.likes.splice(likeIndex, 1);
        comment.likesCount = (comment.likesCount || 0) - 1; // Decrement like count, default to 0 if undefined
    }

    // Save the updated comment
    await comment.save();

    // Respond with the updated comment
    res.status(200).json(new ApiResponse(200, { comment }, "Comment like toggled successfully"));
});
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet

    const userId = req.user._id; 

    // Check if the comment exists
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Comment not found");
    }

    // Initialize likes array if it is not defined
    if (!tweet.likes) {
        tweet.likes = [];
    }

    // Check if the user has already liked the comment
    const likeIndex = tweet.likes.indexOf(userId);

    if (likeIndex === -1) {
        tweet.likes.push(userId);
        tweet.likesCount = (tweet.likesCount || 0) + 1; // Increment like count, default to 0 if undefined
    } else {
        // User has already liked the comment, so remove the like
        tweet.likes.splice(likeIndex, 1);
        tweet.likesCount = (tweet.likesCount || 0) - 1; // Decrement like count, default to 0 if undefined
    }

    // Save the updated comment
    await tweet.save();

    // Respond with the updated comment
    res.status(200).json(new ApiResponse(200, { tweet }, "Comment like toggled successfully"));


}
);

const getLikedVideos = asyncHandler(async (req, res) => {
    // Find videos with likesCount greater than 0
    const likedVideos = await Video.find({ likesCount: { $gt: 0 } });


    if (!likedVideos.length) {
        throw new ApiError(404, "There are no videos liked by anyone");
    }

    res.status(200)
        .json(new ApiResponse(200, { likedVideos }, "Liked videos are displayed successfully"));
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}