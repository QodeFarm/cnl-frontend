import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()

export class GlobalErrorHandlerService implements ErrorHandler {

   constructor() {
   }

   handleError(error: { message: any; }) {
       
      try {
         console.error('An error occurred:', error);
         throw new Error('An error occurred');
      }
      catch (error) {
         console.error('Here is the error message', error);
      }
   }

}