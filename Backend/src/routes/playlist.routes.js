import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/createplaylist").post(createPlaylist)

router.route("/getallplaylists").get(getUserPlaylists)

router.route("/playlistById/:playlistId").get(getPlaylistById); 

router.route("/delete/:playlistId").delete(deletePlaylist);

router.route("/updatePlaylist/:playlistId").patch(updatePlaylist)
    

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);

router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);

router.route("/user/:userId").get(getUserPlaylists);

export default router