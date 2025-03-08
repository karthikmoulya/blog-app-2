import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit {
  posts: any[] = [];
  newPost = { title: '', content: '' };
  error: string | null = null;
  isAuthenticated: boolean = false;

  constructor(
    private postService: PostService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.fetchPosts();
    } else {
      this.router.navigate(['/login']);
    }
  }

  fetchPosts(): void {
    this.postService.getPosts().subscribe((posts) => {
      this.posts = posts;
    });
  }

  createPost(): void {
    this.postService.createPost(this.newPost).subscribe({
      next: () => {
        this.newPost = { title: '', content: '' };
        this.fetchPosts();
      },
      error: (err) => {
        this.error = err.error.message || 'Failed to create post.';
      },
    });
  }

  deletePost(id: string): void {
    this.postService.deletePost(id).subscribe(() => {
      this.fetchPosts();
    });
  }
}
