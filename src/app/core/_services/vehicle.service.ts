import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/from.js';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { environment } from '../../../environments/environment';

import * as _ from 'lodash';


const apiURL:string = 'https://vpic.nhtsa.dot.gov/api/vehicles/';

@Injectable({
    providedIn: 'root'
})


export class VehicleService {
   
    

    constructor(private httpClient: HttpClient, private router: Router) {}

    createAuthorizationHeader(headers: Headers) {
      headers.append('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'); 
      headers.append('accept-encoding', 'gzip, deflate, br')
      headers.append('accept-language', 'en-GB,en-US;q=0.9,en;q=0.8')
    }
    public getDataByVIN(vin): Observable<any | false> {
        return this.httpClient
        .get(apiURL+'decodevinvaluesextended/'+vin+'?format=json')
        .map((response: Response) => {           
          return response;
        })
    }

    public getAllMakesByYear(year, Manufacturer): Observable<any | false> {       
        return this.httpClient
        .get(apiURL+'GetMakesForManufacturerAndYear/'+Manufacturer+'?year='+year+'&format=json')
        //.get(apiURL+'/getallmakes?format=json')
        .map((response: Response) => {           
          return response;
        })
    }
    
    public getAllModelsByMakeId(makeID): Observable<any | false> {       
        return this.httpClient
        //.get(apiURL+'GetModelsForMakeId/'+makeID+'?format=json')
        .get(apiURL+'getmodelsformake/'+makeID+'?format=json')
        .map((response: Response) => {           
          return response;
        })
    }

    /**
     * Add Your Vehicle
     * @param vehicleData    Vehicle Details.
     * @return        Observable<any>
    */
   addYourVehicle(vehicleData): Observable<any> {

    return this.httpClient
    .post('car/newCar', vehicleData)
    .map((response: Response) => {
        return response;
    })

  }
  /**
     * Add Your Vehicle
     * @param vehicleData    Vehicle Details.
     * @return        Observable<any>
    */
   editYourVehicle(vehicleData): Observable<any> {

    return this.httpClient
    .post('car/editCar', vehicleData)
    .map((response: Response) => {
        return response;
    })
  }

  /**
   * Fetch city, state information of zipcode
   * @param zipcode    Vehicle zipcode.
   * @return        Observable<any>
  */
  public fetchCityStateOfZipcode(zipcode): Observable<any> {  
    
    let url = `${environment.ADDRESS_API.ENDPOINT}/lookup?auth-id=${environment.ADDRESS_API.KEY}&auth-token=${environment.ADDRESS_API.TOKEN}&zipcode=${zipcode}`;

    return this.httpClient.get(url)
        .map((response: any) => {         
            return response;
        })
  }

    
    
}