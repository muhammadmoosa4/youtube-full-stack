import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { upload } from "../middlewares/multer.middleware.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'desc', userId } = req.query;

    const filter = {};
    if (query) {
        filter.title = { $regex: query, $options: 'i' };
    }
    if (userId) {
        filter.userId = userId; 
    }

    const sort = {};
    sort[sortBy] = sortType === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

   
    const videos = await Video.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const totalVideos = await Video.countDocuments(filter);

    res.json({
        page,
        totalPages: Math.ceil(totalVideos / limit),
        totalVideos,
        videos,
    });
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video


    if (!title && !description) {
        throw new ApiError(400,"title and description is required")
    }

    // console.log(req.files);

    const videoFileLocalPath = req.files.videoFile[0]?.path
    
    // console.log(videoFileLocalPath);
    
    // thumbnail 

    const ThumbnailLocalFilePath = req.files.thumbnail[0].path

    // console.log(ThumbnailLocalFilePath);
    

    const videoFileCouldinaryUrl = await  uploadOnCloudinary(videoFileLocalPath);

    const ThumnailCloundnaryUrl = await uploadOnCloudinary(ThumbnailLocalFilePath)
    
    // console.log(videoFileCouldinaryUrl);
    

    const video = await Video.create({
        videoFile:videoFileCouldinaryUrl.url,
        thumbnail:ThumnailCloundnaryUrl?.url,
        title:title,
        description,
        duration:videoFileCouldinaryUrl?.duration
        
    })
    
    res.status(200)
    .json(new ApiResponse(200,{video}, " video is publsished succesfully"))
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params


    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400,"this video does not exist")
    }

    res.status(200)
    .json(new ApiResponse(200 , {video} , "video is getted succesfully"))
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if (!videoId) {
        return res.status(400).json({ message: "Video ID is required" });
    }
    // console.log(videoId);

    const deletedVideo = await Video.findByIdAndDelete(videoId)
    
    res.json(200,deletedVideo)
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    // Extract data from request
    const { title, description } = req.body; // Assuming these are passed in the body
    const thumbnailLocalFilePath = req.file?.path; // `path` is typically used to store file location

    const updatedthumbnailCloudinaryUrl = await uploadOnCloudinary(thumbnailLocalFilePath)

    try {
        // Find the video by ID and update its details
        const video = await Video.findByIdAndUpdate(
            videoId,
            {
                $set: {
                    ...(title && { title }), // Only update if title is provided
                    ...(description && { description }), // Only update if description is provided
                    ...(updatedthumbnailCloudinaryUrl?.url && { thumbnail: updatedthumbnailCloudinaryUrl?.url }), // Only update if thumbnail is provided
                },
            },
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        res.status(200)
        .json(new ApiResponse(200 , video , "video details are updated succesfully")); // Send back the updated video
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Find the video by ID
    const video = await Video.findById(videoId);
    if (!video) {
        return res.status(404).json({ message: "Video not found" });
    }

    // Toggle the `isPublished` field
    video.isPublished = !video.isPublished;

    // Save the updated video
    const updatedVideo = await video.save();

    res.status(200).json({
        message: "Publish status toggled successfully",
        video: updatedVideo
    });
});


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
