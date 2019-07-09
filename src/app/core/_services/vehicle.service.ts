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


    /**
     * get Vehicle Details By VIN
     * @param vin    Vehicle Vin Number.
     * @return       Vehicle Details<array>
    */
    public getDataByVIN(vin): Observable<any | false> {
        return this.httpClient
        .get(apiURL+'decodevinvaluesextended/'+vin+'?format=json')
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
     * get Trims By Make Name
     * @param makeName   Make Name.
     * @return Observable<any>
    */
    getTrimsByMakeName(makeData): Observable<any> {

        return this.httpClient
        .post('common/ListingTrimsByMakeName', makeData)
        .map((response: Response) => {
            return response;
        })

    }

    /**
     * get Vehicle Details by Trim ID
     * @param trimData   Trim Id.
     * @return Observable<any>
    */
    getVehicleDetailsByTrimId(trimData): Observable<any> {
        return this.httpClient
        .post('common/ListingVehicleDetailsByTrimId', trimData)
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

    /**
     * Fetch car details
     * @param carObject    car object to fetch from database.
     * @return        Observable<any>
    */
    public fetchCarDetails(carIdObject): Observable<any> {

        return this.httpClient.post('car/carDetail', carIdObject)
            .map((response: any) => {
                //let car = new Car(response);
                //console.log('car detail', car);
                return response;
            })
    }
    
    
}