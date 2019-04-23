import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/observable/of';
import { delay } from "rxjs/operators";
import { PagedData, Car, Page } from "../../core/_models";

/**
 * A server used to mock a paged data result from a server
 */
@Injectable()
export class CarService {

    
    constructor(private httpClient: HttpClient) { }

    /**
     * List seller's car
     * @param page    passed object of Page.
     * @return        Observable<PagedData<Car>>
    */

    public listingCars(page: Page): Observable<PagedData<Car>> {
    
        //page['seller_id'] = localStorage.getItem('loggedinUserId') 
        page['seller_id'] = '5c99ee618fb7ce6cf845a53d'
        return this.httpClient.post('car/listingCars', page,)
        .map((response: any) => {         
            
            page.totalElements = response.count;
            let pagedData = new PagedData<Car>();
            page.totalElements = response.count;
            page.filteredElements = response.filteredRecords;
            page.totalPages = page.totalElements / page.size;
            let start = page.pageNumber * page.size;        
            for(let i in response.records){            
                let jsonObj = response.records[i];
                let car = new Car(jsonObj);
                pagedData.data.push(car);
            }
            pagedData.page = page;
            return pagedData;
        })    
    }

    /**
     * List cars on which delaer has posted the bids
     * @param page    passed object of Page.
     * @return        Observable<PagedData<Car>>
    */
    public listingDealersCars(page: Page): Observable<PagedData<Car>> {
   
        //page['dealer_id'] = localStorage.getItem('loggedinUserId')   
        page['dealer_id'] = '5ca1e88f9dac60394419c0bc'
         
        return this.httpClient.post('car/listingDealersCars', page,)
        .map((response: any) => {
            console.log('response',response);
            
            page.totalElements = response.count;

            let pagedData = new PagedData<Car>();
            page.totalElements = response.count;
            page.totalPages = page.totalElements / page.size;
            let start = page.pageNumber * page.size;    
            for(let i in response.records){            
                let jsonObj = response.records[i];
                let car = new Car(jsonObj);
                pagedData.data.push(car);
            }
            pagedData.page = page;
            return pagedData;
        })    
    }

    /**
     * Delete car
     * @param carObject    car object to delete from database.
     * @return        Observable<any>
    */
    public deleteCar(carObject): Observable<any> {

        return this.httpClient.post('car/deleteCar', carObject)
        .map((response: any) => response )    
    }

    


}
