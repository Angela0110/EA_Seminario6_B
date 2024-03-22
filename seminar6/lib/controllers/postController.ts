import { Request, Response } from 'express';
import { IPost } from '../modules/posts/model';
import PostService from '../modules/posts/service';
import UserService from '../modules/users/service';
import e = require('express');
import { Types } from 'mongoose';

export class PostController {

    private post_service: PostService = new PostService();
    private user_service: UserService = new UserService();

    public async createPost(req: Request, res: Response) {
        try{
            // this check whether all the filds were send through the request or not
            if (req.body.title && req.body.content && req.body.author){
                const post_params:IPost = {
                    title: req.body.title,
                    content: req.body.content,
                    author: req.body.author
                };
                const post_data = await this.post_service.createPost(post_params);
                 // Now, you may want to add the created post's ID to the user's array of posts
                await this.user_service.addPostToUser(req.body.author, post_data._id); //
                return res.status(201).json({ message: 'Post created successfully', post: post_data });
            }else{            
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getPost(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const post_filter = { _id: req.params.id };
                // Fetch user
                const post_data = await this.post_service.filterPost(post_filter);
                // Send success response
                return res.status(200).json({ data: post_data, message: 'Successful'});
            } else {
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getAll(req: Request, res: Response) {
        const post_filter = { };
        const post_data = await this.post_service.getAll(post_filter);
        return res.status(200).json(post_data);    
    }


    public async deletePost(req: Request, res: Response) {
        try {
            if (req.params.id) {
                // Delete post
                const delete_details = await this.post_service.deletePost(req.params.id);
                if (delete_details.deletedCount !== 0) {
                    // Send success response if user deleted
                    return res.status(200).json({ message: 'Successful'});
                } else {
                    // Send failure response if user not found
                    return res.status(400).json({ error: 'Post not found' });
                }
            } else {
                // Send error response if ID parameter is missing
                return res.status(400).json({ error: 'Missing Id' });
            }
        } catch (error) {
            // Catch and handle any errors
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async update_post(req: Request, res: Response) {
        try {
            if (req.params.id) {
                const post_filter = { _id: req.params.id };
                // Fetch user
                const post_data = await this.post_service.filterPost(post_filter);
                if (!post_data) {
                    // Send failure response if user not found
                    return res.status(400).json({ error: 'Post not found'});
                }
    
                const post_params: IPost = {
                    _id: new Types.ObjectId(req.params.id),
                    title: req.body.title,
                    content: req.body.content,
                    author: req.body.author
                };
                // Update user
                await this.post_service.updatePost(post_params);
                //get new user data
                const new_post_data = await this.post_service.filterPost(post_filter);
                // Send success response
                return res.status(200).json({ data: new_post_data, message: 'Successful'});
            } else {
                // Send error response if ID parameter is missing
                return res.status(400).json({ error: 'Missing ID parameter' });
            }
        } catch (error) {
            // Catch and handle any errors
            console.error("Error updating:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    


}