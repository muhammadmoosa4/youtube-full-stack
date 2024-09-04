import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    
    const {channelName} = req.params


const channel = await User.aggregate([
    {
        $match: {
            username: channelName
        }
    },
    {
        $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "subscriber",
            as: "subscribedTO"
        }
    },
    {
        $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribers"
        }
    },
    {
        $addFields: {
            subscribersCount: {
                $size: "$subscribers"
            },
            subscribedToCount: {
                $size: "$subscribedTO"
            },
            isSubscribed: {
                $cond: {
                    if: {
                        $in: [
                            req.user._id,
                            { $map: { input: "$subscribers", as: "sub", in: "$$sub.subscriber" } }
                        ]
                    },
                    then: true,
                    else: false
                }
            }
        }
    }
]);

if (channel.length > 0) {
    const channelId = channel[0]._id;

    if (channel[0].isSubscribed) {
        // User is already subscribed, so unsubscribe and decrement the count
        await Subscription.deleteOne({ subscriber: req.user._id, channel: channelId });

        await User.updateOne(
            { _id: channelId },
            { $inc: { subscribedToCount: -1 } }
        );

        channel[0].isSubscribed = false;
        channel[0].subscribedToCount -= 1;
    } else {
        // User is not subscribed, so subscribe and increment the count
        await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        });

        await User.updateOne(
            { _id: channelId },
            { $inc: { subscribedToCount: 1 } }
        );

        channel[0].isSubscribed = true;
        channel[0].subscribedToCount += 1;
    }

    console.log(channel[0]);
}

    res.status(200)
    .json(new ApiResponse(200 , {channel} , "channel subcribers and subcribed channels are displayed"))


});
// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {

    const {channelName} = req.params

    const channel =await User.aggregate([
        {
            $match : {
                username : channelName
            }
        },
        {
            $lookup:{
                from : "subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subcribedTO"
            }
        },
        {
            $lookup:{
                from : "subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subcribers"
            }
        },{
            $addFields:{
                subscribers:{
                    $size : "$subcribers"
                },
                subscribedTo : {
                    $size : "$subcribedTO"
                }
               
                
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    if (!channel) {
        throw new ApiError(400 , " this channel does not exist")
    }

    res.status(200)
    .json(new ApiResponse(200 , {channel} , "channel subcribers and subcribed channels are displayed"))

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    
    const {channelName} = req.params

    const channel =await User.aggregate([
        {
            $match : {
                username : channelName
            }
        },
        {
            $lookup:{
                from : "subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subcribedTO"
            }
        },
        {
            $lookup:{
                from : "subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subcribers"
            }
        },{
            $addFields:{
                subscribers:{
                    $size : "$subcribers"
                },
                subscribedTo : {
                    $size : "$subcribedTO"
                },
                
            }
        }
    ])

    if (!channel) {
        throw new ApiError(400 , " this channel does not exist")
    }

    res.status(200)
    .json(new ApiResponse(200 , {channel} , "channel subcribers and subcribed channels are displayed"))

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}