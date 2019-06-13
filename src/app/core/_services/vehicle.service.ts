import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/from.js';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { environment } from '../../../environments/environment';

import { Vehicle } from "../../core/_models";
import * as _ from 'lodash';


const apiURL:string = 'https://www.carqueryapi.com/api/0.3/?callback=getData';


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

    public getAllMakesByYear(data): Observable<any | false> {   
              
        return this.httpClient
        .get(apiURL+'&cmd=getMakes&year='+data.year)
        .map((response) => {      
            console.log('getMakes', response);     
          //return response;
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
     * Fetch car details
     * @param carObject    car object to fetch from database.
     * @return        Observable<any>
    */
    getAllVehicleDetails(response): Observable<any>{
       
        return Observable.create(obs => {        
            let vehicle = new Vehicle(response);   
            obs.next(vehicle);
            return;
                
        });

    }
    
    
}