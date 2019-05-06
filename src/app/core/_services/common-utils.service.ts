import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class

//import shared services
import { PageLoaderService } from '../../shared/_services'

import { environment } from '../../../environments/environment'

import Swal from 'sweetalert2'

@Injectable()
export class CommonUtilsService {
  currentYear: number = new Date().getFullYear();   // get Current Year

  constructor(private httpClient: HttpClient, private pageLoaderService: PageLoaderService, private toastrManager: ToastrManager, ) { }

  /**
  * Fetch all US states 
  * @return Observable type collection of states having id, name, abbreviation attributes
  */
  public getStates(): Observable<any> {

    return this.httpClient
      .get('common/fetchStates')
      .map((response: Response) => {
        return response;
      })

  }

  /**
  * To check the image validity for type jpeg, png, jpg
  * @return boolean
  * @param base64string image base64 string 
  * @param type image type (jpeg, png, jpg)
  */
  public isImageCorrupted(base64string, type): boolean {

    if (type == 'png') {
      console.log('get filetype', type)
      const imageData = Array.from(atob(base64string.replace('data:image/png;base64,', '')), c => c.charCodeAt(0))
      const sequence = [0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]; // in hex: 

      //check last 12 elements of array so they contains needed values
      for (let i = 12; i > 0; i--) {
        if (imageData[imageData.length - i] !== sequence[12 - i]) {
          return false;
        }
      }

      return true;
    }
    else if (type == 'jpeg' || type == 'jpg') {
      const imageDataJpeg = Array.from(atob(base64string.replace('data:image/jpeg;base64,', '')), c => c.charCodeAt(0))
      const imageCorrupted = ((imageDataJpeg[imageDataJpeg.length - 1] === 217) && (imageDataJpeg[imageDataJpeg.length - 2] === 255))
      return imageCorrupted;
    }
  }

  /**
  * Show confirmation popup before delete the record.
  * @return any
  */
  public isDeleteConfirmed(): any {

    let isConfirmed = Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      return (result.value) ? true : false
    })

    return isConfirmed;
  }

  /**
  * Show page loder on fetching data
  * @return void
  */
  public showPageLoader(): void {
    this.pageLoaderService.setLoaderText(environment.MESSAGES.FETCHING_RECORDS);//setting loader text
    this.pageLoaderService.pageLoader(true);//show page loader
  }

  /**
  * Hide page loder on fetching data
  * @return void
  */
  public hidePageLoader(): void {
    this.pageLoaderService.pageLoader(false);//hide page loader
    this.pageLoaderService.setLoaderText('');//setting loader text
  }

  /**
  * Show alert on success response & hide page loader
  * @return void
  */
  public onSuccess(message): void {
    this.pageLoaderService.pageLoader(false);//hide page loader
    this.pageLoaderService.setLoaderText('');//setting loader text empty
    this.toastrManager.successToastr(message, 'Success!'); //showing success toaster 
  }

  /**
  * Show alert on error response & hide page loader
  * @return void
  */
  public onError(message): void {
    this.pageLoaderService.setLoaderText(environment.MESSAGES.ERROR_TEXT_LOADER);//setting loader text
    this.pageLoaderService.pageLoader(false);//hide page loader
    this.toastrManager.errorToastr(message, 'Oops!');//showing error toaster message  
  }

  /**
  * Remove Image from AWS Bucket
  * @return boolean
  */
  public removeImageFromBucket(params): Observable<any> {
    return this.httpClient
      .post('common/removeImage', params)
      .map((response: Response) => {
        return response;
      })
  }

  /** ToDo
   * show last 2 years list in the year dropdown
  */
  public createYearRange() {
    let years = [];
    for (let i = 0; i < 2; i++) {
      years.push({
        label: this.currentYear - i,
        value: this.currentYear - i
      });
    }
    console.log('typeof', typeof years);
    return <Array<any>>years;
  }

  /**
   * Fetch make,model,year by year
   * @param year    pass year.
   * @return        Observable<any>
  */
  public getVehicleStatisticsByMultipleyear(year): Observable<any> {
    return this.httpClient.post('common/fetchVehicleStatisticsByMultipleyear', year)
      .map((response: any) => {
        //console.log(response); 
        return response;
      })
  }


  /**
   * Fetch make,model,year by year
   * @param year    pass year.
   * @return        Observable<any>
  */
  public getVehicleStatisticsByMultiplemake(year): Observable<any> {
    return this.httpClient.post('common/fetchVehicleStatisticsByMultiplemake', year)
      .map((response: any) => {
        //console.log(response); 
        return response;
      })
  }

  /**
   * Fetch make,model,year by year
   * @param year    pass year.
   * @return        Observable<any>
  */
  public getVehicleStatisticsByMultiplemodel(year): Observable<any> {
    return this.httpClient.post('common/fetchVehicleStatisticsByMultiplemodel', year)
      .map((response: any) => {
        //console.log(response); 
        return response;
      })
  }


  /**
     * get Vehicle Details from DB
     * @param year selected year from dropdown.
     * @return  array(vehicle details)       
    */
  public getVehicleStatisticsByYear(year): Observable<any> {
    return this.httpClient.post('common/fetchVehicleStatisticsByYear', year)
      .map((response: any) => {
        //console.log(response); 
        return response;
      })
  }





}