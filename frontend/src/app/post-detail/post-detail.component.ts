import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
})
export class PostDetailComponent implements OnInit {
  post: any;
  updatedPost = { title: '', content: '' };
  error: string | null = null;
  isAuthenticated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.postService.getPost(id).subscribe((post) => {
        this.post = post;
        this.updatedPost = { ...post };
      });
    }
  }

  updatePost(): void {
    if (this.post && this.post._id) {
      this.postService.updatePost(this.post._id, this.updatedPost).subscribe({
        next: (updatedPost) => {
          this.post = updatedPost;
        },
        error: (err) => {
          this.error = err.error.message || 'Failed to update post.';
        },
      });
    }
  }
}
