import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
  constructor(private dialog:MatDialog){}
  intercept(req: HttpRequest<any>, next: HttpHandler) {

    // if we get back an error response on any one of our Angular
    // Outgoing requests, this will catch it and display an appropriate message.
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse)=>{
        let errorMessage = "An Unknown Error Occured"
        if (error.error.message){
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent,{data: {message:errorMessage}});
        return throwError(error);
      })
    );
  }
}
