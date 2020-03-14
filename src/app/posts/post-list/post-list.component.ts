import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {Post} from "../posts.model"
import { PostService } from '../posts.service';
import {Subscription} from "rxjs";
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title:"First Post", content:"This is our first post's content"},
  //   {title:"Second Post", content:"This is our second post's content"},
  //   {title:"Third Post", content:"This is our third post's content"}
  // ]
  posts: Post[] = [];
  private postsSub: Subscription;
  isloading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  private authStatusSubs: Subscription;
  userIsAuthenticated = false;
  userId: string;

  constructor(public postsService: PostService, private authService:AuthService) {}
  ngOnInit() {
      this.isloading = true;
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
      this.userId = this.authService.getUserId();
      this.postsSub = this.postsService.getPostUpdateListener()
        .subscribe((postData:{posts: Post[], postCount:number}) =>{
          this.isloading = false;
          this.posts = postData.posts;
          this.totalPosts = postData.postCount;
        });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(
          isAuthenticated =>{
            this.userIsAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserId();
          }
        )
  }

  onChangePage(pageData : PageEvent) {
    this.isloading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
  onDelete(postId: String){
    this.isloading = true;
    this.postsService.deletePost(postId).subscribe(()=>{
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, ()=>{
      this.isloading = false;
    });
}

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }
}
