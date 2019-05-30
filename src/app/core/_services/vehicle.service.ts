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

  public fetchAddress(): Observable<any> {
    let key = '4a26c4bf-dcae-92b5-e8ee-0937ca13e1c1'
    let token = 'DwDT9GApVGQdUlxLVHtB'
    return this.httpClient.get('https://us-zipcode.api.smartystreets.com/lookup?auth-id='+key+'&auth-token='+token+'&zipcode=85297')
        .map((response: any) => {         
            return response;
        })
}

    
    
}