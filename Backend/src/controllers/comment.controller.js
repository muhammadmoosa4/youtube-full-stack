import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const pipeline = [
        { $match: { video: new mongoose.Types.ObjectId(videoId) } },
        { $sort: { createdAt: -1 } }
    ];

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    
    


    const result = await Comment.aggregatePaginate(pipeline, options);

    console.log(result);
    res.status(200)
    .json(new ApiResponse(200 , result , "all comments on the video are getted"));
})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body; // Assuming the comment content is provided in the request body

    if (!content) {
        throw new ApiError(400 , "comment content is required")
    }

    // Create a new comment
    const newComment =await Comment.create({
        content,
        video:new mongoose.Types.ObjectId(videoId),
        owner: req.user._id // Assuming req.user is populated by the verifyJWT middleware
    });

    // Save the comment to the database
    await newComment.save();
        

    res.status(200)
    .json(new ApiResponse(200 , newComment , "comment is created succesfully"));
    
});


const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    
    if (!content) {
        return res.status(400).json(new ApiError("Comment content is required."));
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $set: { content } },
        { new: true, runValidators: true }
    );

    if (!updatedComment) {
        return res.status(404).json(new ApiError("This comment does not exist."));
    }

    res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully."));
});


const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(
        commentId
    )

    res.status(
        200
    )
    .json(
        new ApiResponse(200,{deletedComment},"commented is deleted succesfully")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
