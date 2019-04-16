import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CommonUtilsService {

    constructor(private httpClient: HttpClient) { }

    public getStates(): Observable<any> {

        return this.httpClient
          .get('common/fetchStates')
          .map((response: Response) => {
            return response;
          })
    
    }
    public isImageCorrupted(base64string,type){
        console.log('base64string',base64string);
        if(type=='png'){   
          console.log('get filetype',type)
          const imageData = Array.from(atob(base64string.replace('data:image/png;base64,', '')), c => c.charCodeAt(0))
          const sequence = [0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]; // in hex: 
          
          //check last 12 elements of array so they contains needed values
          for (let i = 12; i > 0; i--){
              if (imageData[imageData.length - i] !== sequence[12-i]) {
                  return false;
              }
          }
          
          return true;
        }
        else if(type=='jpeg' || type=='jpg'){ 
          console.log('get filetype',type)
          const imageDataJpeg = Array.from(atob(base64string.replace('data:image/jpeg;base64,', '')), c => c.charCodeAt(0))
          const imageCorrupted = ((imageDataJpeg[imageDataJpeg.length - 1] === 217) && (imageDataJpeg[imageDataJpeg.length - 2] === 255))
          //console.log('imageCorrupted jpeg',imageCorrupted)
          return imageCorrupted;
         
        }
      }

    
}