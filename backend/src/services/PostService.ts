import { NextFunction, Request, Response } from 'express';
import {
  CreatePostInput,
  DeletePostInput,
  GetPostInput,
  UpdatePostInput,
} from '../schemas/PostSchema';
import { createPost, findPosts, getPost } from '../repositories/PostRepository';
import { findUserById } from '../repositories/UserRepository';
import AppError from '../utils/appError';

// 👈 POST method:- Create a new Post
export const createPostHandler = async (
  req: Request<{}, {}, CreatePostInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserById(res.locals.user.id as string);

    const post = await createPost(req.body, user!);

    res.status(201).json({
      status: 'success',
      data: {
        post,
      },
    });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: 'Post with that title already exist',
      });
    }
    next(err);
  }
};

// 👈 GET method:- Create a new Post
export const getPostHandler = async (
  req: Request<GetPostInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await getPost(req.params.postId);

    if (!post) {
      return next(new AppError(404, 'Post with that ID not found'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        post,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

// 👈 GET method:- Get all Posts
export const getPostsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await findPosts({}, {}, {});

    res.status(200).json({
      status: 'success',
      data: {
        posts,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

// 👈 PATCH method:- Update Post
export const updatePostHandler = async (
  req: Request<UpdatePostInput['params'], {}, UpdatePostInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await getPost(req.params.postId);

    if (!post) {
      return next(new AppError(404, 'Post with that ID not found'));
    }

    Object.assign(post, req.body);

    const updatedPost = await post.save();

    res.status(200).json({
      status: 'success',
      data: {
        post: updatedPost,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

// 👈 POST method:- Delete Post
export const deletePostHandler = async (
  req: Request<DeletePostInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await getPost(req.params.postId);

    if (!post) {
      return next(new AppError(404, 'Post with that ID not found'));
    }

    await post.remove();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err: any) {
    next(err);
  }
};

export const parsePostFormData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.data) return next();
    const parsedBody = { ...JSON.parse(req.body.data) };
    if (req.body.image) {
      parsedBody['image'] = req.body.image;
    }

    req.body = parsedBody;
    next();
  } catch (err: any) {
    next(err);
  }
};
