import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/of';
import { PagedData, Purchase, Page } from "../../core/_models";
import { DealerRatingReview } from '../_models'
/**
 * A server used to mock a paged data result from a server
 */
@Injectable()
export class DealerService {

    constructor(private httpClient: HttpClient) { }

    /**
    * List seller's car
    * @param page    passed object of Page.
    * @return        Observable<PagedData<Car>>
   */

    public getPurchaseList(page: Page): Observable<any> {

        page['dealer_id'] = localStorage.getItem('loggedinUserId') 
        // page['dealer_id'] = '5ca1e88f9dac60394419c0bc'
        return this.httpClient.post('dealer/getPurchaseList', page)
            .map((response: any) => {
                console.log('response', response);

                page.totalElements = response.count;
                let pagedData = new PagedData<Purchase>();
                page.totalElements = response.count;
                page.totalPages = page.totalElements / page.size;
                let start = page.pageNumber * page.size;
                for (let i in response.records) {
                    let jsonObj = response.records[i];
                    let car = new Purchase(jsonObj);
                    pagedData.data.push(car);
                }
                pagedData.page = page;
                return pagedData;
            });
    }



    public getDealerRatingList(page: Page): Observable<any> {

        page['dealer_id'] = localStorage.getItem('loggedinUserId')
        // page['seller_id'] = '5cd170562688321559f12f32'
        return this.httpClient.post('car/getDealerRating', page)
            .map((response: any) => {
                console.log('response', response);

                page.totalElements = response.count;
                let pagedData = new PagedData<DealerRatingReview>();
                page.totalElements = response.count;
                page.totalPages = page.totalElements / page.size;
                let start = page.pageNumber * page.size;
                for (let i in response.records) {
                    let jsonObj = response.records[i];
                    let carRate = new DealerRatingReview(jsonObj);
                    pagedData.data.push(carRate);
                }
                pagedData.page = page;
                return pagedData;
            });
    }

    public saveSellerRating(postedData: any): Observable<any> {
        postedData['dealer_id'] = localStorage.getItem('loggedinUserId');
        return this.httpClient.post('car/saveSellerRating', postedData).map((response: any) => response);

    }

}
