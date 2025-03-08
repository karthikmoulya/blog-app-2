import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Import Types
import { Post } from './entities/post.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('PostsService', () => {
  let postsService: PostsService;
  let postModel: Model<Post>;

  const mockPostModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken(Post.name),
          useValue: mockPostModel,
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    postModel = module.get<Model<Post>>(getModelToken(Post.name));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(postsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const authorId = new Types.ObjectId(); // Create a mock ObjectId
      const createPostDto = {
        title: 'Test Post',
        content: 'Test Content',
        author: authorId, // Use the ObjectId
      };
      const createdPost = { ...createPostDto, _id: 'post123' };
      mockPostModel.create.mockResolvedValue(createdPost);

      const result = await postsService.create(createPostDto);
      expect(result).toEqual(createdPost);
      expect(mockPostModel.create).toHaveBeenCalledWith(createPostDto);
    });
  });

  // ... (rest of the tests)
});
