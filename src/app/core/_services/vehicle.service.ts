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

const headers = new HttpHeaders();
headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');
headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
headers.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
headers.set('Access-Control-Allow-Credentials', 'true');
headers.set('Content-Type', 'application/json');

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
        .get(apiURL+'&cmd=getMakes&year='+data.year, {headers: headers, responseType: 'text'})
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