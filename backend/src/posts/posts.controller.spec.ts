import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jw-auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('PostsController', () => {
  let postsController: PostsController;
  let postsService: PostsService;

  const mockPostsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{ provide: PostsService, useValue: mockPostsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    postsController = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(postsController).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test Content',
        author: new Types.ObjectId(),
      };
      const req = { user: { userId: 'user123' } };
      const createdPost = {
        ...createPostDto,
        author: req.user.userId,
        _id: 'post123',
      };
      mockPostsService.create.mockResolvedValue(createdPost);

      const result = await postsController.create(createPostDto, req);
      expect(result).toEqual(createdPost);
      expect(postsService.create).toHaveBeenCalledWith({
        ...createPostDto,
        author: req.user.userId,
      });
    });
  });

  describe('findAll', () => {
    it('should find all posts', async () => {
      const posts = [{ title: 'Post 1' }, { title: 'Post 2' }];
      mockPostsService.findAll.mockResolvedValue(posts);

      const result = await postsController.findAll();
      expect(result).toEqual(posts);
      expect(postsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a post by id', async () => {
      const post = { _id: 'post123', title: 'Test Post' };
      mockPostsService.findOne.mockResolvedValue(post);

      const result = await postsController.findOne('post123');
      expect(result).toEqual(post);
      expect(postsService.findOne).toHaveBeenCalledWith('post123');
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto: UpdatePostDto = { title: 'Updated Post' };
      const req = { user: { userId: 'user123' } };
      const updatedPost = {
        _id: 'post123',
        ...updatePostDto,
        author: req.user.userId,
      };
      mockPostsService.update.mockResolvedValue(updatedPost);

      const result = await postsController.update(
        'post123',
        updatePostDto,
        req,
      );
      expect(result).toEqual(updatedPost);
      expect(postsService.update).toHaveBeenCalledWith(
        'post123',
        updatePostDto,
        req.user.userId,
      );
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      const req = { user: { userId: 'user123' } };
      const deletedPost = { _id: 'post123', author: req.user.userId };
      mockPostsService.remove.mockResolvedValue(deletedPost);

      const result = await postsController.remove('post123', req);
      expect(result).toEqual(deletedPost);
      expect(postsService.remove).toHaveBeenCalledWith(
        'post123',
        req.user.userId,
      );
    });
  });
});
