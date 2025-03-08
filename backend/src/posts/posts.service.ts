import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = this.postModel.create(createPostDto);
    return createdPost;
  }

  //find all posts
  async findAll(): Promise<Post[]> {
    return this.postModel.find().populate('author').exec();
  }

  async findOne(id: string): Promise<Post | undefined> {
    const post = await this.postModel.findById(id).populate('author').exec();
    return post ? post : undefined;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<Post | undefined> {
    const post = await this.postModel.findById(id).exec();
    if (!post || post.author.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this post',
      );
    }
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .populate('author')
      .exec();
    return updatedPost ? updatedPost : undefined;
  }

  async remove(id: string, userId: string): Promise<Post | undefined> {
    const post = await this.postModel.findById(id).exec();
    if (!post || post.author.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this post',
      );
    }
    const deletedPost = await this.postModel.findByIdAndDelete(id).exec();
    return deletedPost ? deletedPost : undefined;
  }
}
