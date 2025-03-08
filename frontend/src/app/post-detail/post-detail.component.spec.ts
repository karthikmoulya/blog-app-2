import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { PostDetailComponent } from './post-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';
import { AuthService } from '../auth.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let postService: PostService;
  let router: Router;
  let authService: AuthService;
  let activatedRoute: ActivatedRoute;

  const mockPostService = {
    getPost: jest.fn(),
    updatePost: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockAuthService = {
    isAuthenticated: jest.fn(),
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDetailComponent, FormsModule, CommonModule],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService);
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login if not authenticated', () => {
    (authService.isAuthenticated as jest.Mock).mockReturnValue(false);
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should fetch post details if authenticated', () => {
    (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
    (activatedRoute.snapshot.paramMap.get as jest.Mock).mockReturnValue('123');
    const mockPost = {
      _id: '123',
      title: 'Test Post',
      content: 'Test Content',
    };
    (postService.getPost as jest.Mock).mockReturnValue(of(mockPost));
    component.ngOnInit();
    expect(postService.getPost).toHaveBeenCalledWith('123');
    expect(component.post).toEqual(mockPost);
  });

  it('should update post details', fakeAsync(() => {
    (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
    component.post = {
      _id: '123',
      title: 'Test Post',
      content: 'Test Content',
    };
    component.updatedPost = {
      title: 'Updated Title',
      content: 'Updated Content',
    };
    const updatedPost = {
      _id: '123',
      title: 'Updated Title',
      content: 'Updated Content',
    };
    (postService.updatePost as jest.Mock).mockReturnValue(of(updatedPost));
    component.updatePost();
    tick();
    expect(postService.updatePost).toHaveBeenCalledWith(
      '123',
      component.updatedPost
    );
    expect(component.post).toEqual(updatedPost);
  }));
});
