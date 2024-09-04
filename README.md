Backend Overview
Overview
This backend provides essential functionalities for a video-sharing platform, including user management, video management, comment handling, and subscription management.

Features
User Management
Register User: Endpoint to create a new user.
Login: Endpoint to authenticate users and generate tokens.
Logout: Endpoint to invalidate user sessions.
Change Password: Endpoint to update a user's password.
Get Current User: Retrieve information about the logged-in user.
Update User Details: Modify user profile information.
Update User Avatar: Change the user's avatar image.
Update User Cover Image: Update the user's cover photo.
Get User Channel Profile: Retrieve the profile of the user's channel.
Get User Watch History: Access the user's video watch history.
Video Management
Post a Video: Upload and create a new video.
Get Video by ID: Retrieve a specific video based on its ID.
Update a Video: Modify details of an existing video.
Delete a Video: Remove a video from the platform.
Toggle Video Publish Status: Change the video's visibility status.
Get All Videos: Fetch all videos with pagination, sorting, and filtering options.
Get Liked Videos: Retrieve videos that have been liked.
Comment Handling
Add Comment: Post a new comment on a video.
Get Comments: Fetch all comments for a particular video.
Update Comment: Edit the content of an existing comment.
Delete Comment: Remove a comment by its ID.
Toggle Comment Like: Like or unlike a comment.
Playlist Management
Create Playlist: Create a new playlist.
Get Playlist by ID: Retrieve a specific playlist.
Get User Playlists: Fetch all playlists created by a user.
Add Video to Playlist: Add a video to a specific playlist.
Remove Video from Playlist: Remove a video from a playlist.
Delete Playlist: Delete a playlist.
Update Playlist: Modify the name and description of a playlist.
Subscription Management
Toggle Subscription: Subscribe or unsubscribe from a channel.
Get All Subscribers: Retrieve all users subscribed to a channel.
Get All Subscribed Channels: Fetch all channels a user is subscribed to.
Tweet Management
Post a Tweet: Create a new tweet.
Get User Tweets: Retrieve all tweets posted by a specific user.
Update Tweet: Edit an existing tweet.
Delete Tweet: Remove a tweet.
Error Handling
ApiError: Custom error handling for API responses.
ApiResponse: Standardized API response format.
Setup
Clone the Repository: git clone <repo-url>
Install Dependencies: npm install
Run the Server: npm start
Environment Variables: Configure .env for database connection and other settings.
Contributing
Feel free to open issues or submit pull requests to improve the functionality.
