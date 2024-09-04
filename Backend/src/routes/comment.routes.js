import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getVideoComments);
router.route("/addcomment/:videoId").post(addComment)
router.route("/updatecomment/:commentId").patch(updateComment)
router.route("/deletecomment/:commentId").delete(deleteComment)

export default router