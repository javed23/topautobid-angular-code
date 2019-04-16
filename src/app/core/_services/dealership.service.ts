import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/observable/of';
import { delay } from "rxjs/operators";

import { PagedData, Dealership, Page } from "../../core/_models";

/**
 * A server used to mock a paged data result from a server
 */
@Injectable()
export class DealershipService {

    /**
     * A method that mocks a paged server response
     * @param page The selected page
     * @returns {any} An observable containing the employee data
     */
    constructor(private httpClient: HttpClient) { }


    public listingDealerships(page: Page): Observable<PagedData<Dealership>> {
        
        page['dealer_id'] = localStorage.getItem('loggedinUserId')       
        //page['dealer_id'] = null
        console.log('page options',page);
        return this.httpClient.post('dealership/listing', page)
        .map((response: any) => {
            console.log('response',response);
            
            page.totalElements = response.count;

            let pagedData = new PagedData<Dealership>();
            page.totalElements = response.count;
            page.totalPages = page.totalElements / page.size;
            let start = page.pageNumber * page.size;
            //let end = Math.min((start + page.size), page.totalElements);
           // console.log('start',start,'end',end)
            for(let i in response.records){            
                let jsonObj = response.records[i];
                let employee = new Dealership(jsonObj);
                pagedData.data.push(employee);
            }
            pagedData.page = page;
            return pagedData;
        })    
    }

    newDealership(postedData): Observable<any> {

        return this.httpClient
          .post('dealership/addEditDealership', postedData)
          .map((response: Response) => {
            return response;
          })
    
    }

    newLegalContact(postedData): Observable<any> {

        return this.httpClient
          .post('dealership/newLegalContact', postedData)
          .map((response: Response) => {
            return response;
          })
    
    }
    public removeDealership(postedData): Observable<any> {

        return this.httpClient.post('dealership/removeDealership', postedData)
        .map((response: any) => response )    
    }

    


}
