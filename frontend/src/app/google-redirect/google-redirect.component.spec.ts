import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { GoogleRedirectComponent } from './google-redirect.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { of } from 'rxjs';

describe('GoogleRedirectComponent', () => {
  let component: GoogleRedirectComponent;
  let fixture: ComponentFixture<GoogleRedirectComponent>;
  let router: Router;
  let authService: AuthService;
  let activatedRoute: ActivatedRoute;

  const mockAuthService = {
    setToken: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleRedirectComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GoogleRedirectComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set token and navigate to /posts when token is present', fakeAsync(() => {
    (activatedRoute.queryParams as any) = of({ token: 'testToken' });

    component.ngOnInit();
    tick();

    expect(authService.setToken).toHaveBeenCalledWith('testToken');
    expect(router.navigate).toHaveBeenCalledWith(['/posts']);
  }));
});
