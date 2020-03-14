import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {path:'', component: PostListComponent},
  {path:"create", component: PostCreateComponent, canActivate: [AuthGuard]},
  {path:"edit/:postId", component: PostCreateComponent, canActivate: [AuthGuard]},
  {path:"auth", loadChildren:()=> import("./auth/auth.module").then( m => m.AuthModule)}
];
@NgModule({
  // inform angular router about our routes
  imports: [RouterModule.forRoot(routes)],
  //export this new routermodule to add into the main app.module.ts
  exports:[RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule {

}
