import { Component, OnInit, OnDestroy} from '@angular/core';
import {Post} from "../posts.model"
import {FormGroup, FormControl, Validators} from "@angular/forms"
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {mimeType} from "./mime-type.validator"
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector:'app-post-create',
  templateUrl:'./post-create.component.html',
  styleUrls:['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredContent = "";
  enteredTitle = "";
  private mode = "create";
  private postId:string;
  isloading = false;
  form: FormGroup;
  post: Post;
  imagePreview: string;
  private authStatusSub: Subscription;

  constructor(public postService: PostService, public route: ActivatedRoute, private authService:AuthService){}

  ngOnInit(){
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus=>{
        this.isloading = false;
      }
    );
    this.form = new FormGroup({
      title:new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null,{
        validators:[Validators.required]}),
      image: new FormControl(null, {
        validators:[Validators.required],
        asyncValidators:[mimeType]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
        if (paramMap.has("postId")){

          this.mode = "edit";
          this.postId = paramMap.get("postId");
          this.isloading = true;
          this.postService.getPost(this.postId).subscribe(postData =>{
            this.isloading = false;
            this.post = {
              id:postData._id,
              title:postData.title,
              content:postData.content,
              imagePath: postData.imagePath,
              creator: postData.creator
            }
            this.form.setValue({
              title:this.post.title,
              content:this.post.content,
              image: this.post.imagePath
            });
          });
        }
        else {
          this.mode = "create";
          this.postId = null;
        }
    });
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid){
      return;
    }
    this.isloading = true;
    if(this.mode == "create"){
      this.postService.addPost(this.form.value.title,this.form.value.content, this.form.value.image);
      this.isloading = false;
    }
    else{
      this.isloading = false;
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        )
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
