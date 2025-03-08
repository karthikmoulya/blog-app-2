import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PostService } from './post.service';
import { AuthService } from './auth.service';
import { HttpHeaders } from '@angular/common/http';

describe('PostService', () => {
  let postService: PostService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  const mockAuthService = {
    getToken: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PostService,
        { provide: AuthService, useValue: mockAuthService },
      ],
    });

    postService = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(postService).toBeTruthy();
  });
});
