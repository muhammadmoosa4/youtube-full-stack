import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, videosId } = req.body;

    if (!name || !description) {
        throw new ApiError(400, "Playlist name and description are required.");
    }

    let videos = [];
    if (videosId && videosId.length > 0) {
        videos = await Video.find({ _id: { $in: videosId } });
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
        videos : videos
    });

    // Respond with the created playlist
    res.status(200).json(new ApiResponse(200, playlist, "Playlist created successfully."));
});
const getUserPlaylists = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    console.log(userId);

    // Find all playlists where the owner matches the user's ID
    const playlists = await Playlist.find({ owner: userId });

    if (!playlists || playlists.length === 0) {
        throw new ApiError(404, "No playlists found for this user.");
    }

    // Respond with the user's playlists
    res.status(200).json(new ApiResponse(200, playlists, "User's playlists retrieved successfully."));
});
const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(400  , " playlist does not exist")
    }

    res.status(200)
    .json(new ApiResponse(200 , {playlist} , "playlist is getted by id"))
});
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    // Find the playlist first to get the existing videos array
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Check if the video is already in the playlist to avoid duplicates
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video is already in the playlist");
    }

    // Add the new video ID to the videos array
    playlist.videos.push(videoId);

    // Save the updated playlist
    const updatedPlaylist = await playlist.save();

    // Respond with the updated playlist
    res.status(200).json(new ApiResponse(200, updatedPlaylist, "Video added to playlist successfully"));
});
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    // Find the playlist by its ID
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Check if the video is in the playlist
    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video not found in the playlist");
    }

    // Remove the video from the playlist
    playlist.videos = playlist.videos.filter(video => video.toString() !== videoId);

    // Save the updated playlist
    const updatedPlaylist = await playlist.save();

    // Respond with the updated playlist
    res.status(200).json(new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully"));
});
const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

    if (!deletedPlaylist) {
        throw new ApiError(400 , " this playlist does not exist")
    }

    res.status(200)
    .json(new ApiResponse(200 , {deletedPlaylist} , " playlist is deleted succesfully"))
});
const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if (!name && !description) {
        throw new ApiError(400 , " name and description details are required")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set : {
                name,
                description
            }
        },
        {
            new : true , runValidators : true
        }
    )

    if (!updatedPlaylist) {
        throw new ApiError(500 , " error while updating the playlist ")
    }


    res.status(200)
    .json( new ApiResponse(200 , {updatedPlaylist} , "the user playlists detials are updated"))

});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
