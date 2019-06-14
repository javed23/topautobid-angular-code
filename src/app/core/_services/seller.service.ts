import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient} from '@angular/common/http';
import 'rxjs/add/observable/of';
import { PagedData,SellerRatingReview, Page } from "../../core/_models";
import { retry } from 'rxjs/operators';

/**
 * A server used to mock a paged data result from a server
 */
@Injectable()
export class SellerService {

    constructor(private httpClient: HttpClient) { }

     /**
     * List seller's car
     * @param page    passed object of Page.
     * @return        Observable<PagedData<Car>>
    */

   public getSellerRatingList(page: Page): Observable<any> {

    page['seller_id'] = localStorage.getItem('loggedinUserId') 
    // page['seller_id'] = '5cd170562688321559f12f32'
    return this.httpClient.post('car/getsellerRating', page)
        .map((response: any) =>{
            console.log('response', response);

            page.totalElements = response.count;
            let pagedData = new PagedData<SellerRatingReview>();
            page.totalElements = response.count;
            page.totalPages = page.totalElements / page.size;
            let start = page.pageNumber * page.size;
            for (let i in response.records) {
                let jsonObj = response.records[i];
                let carRate = new SellerRatingReview(jsonObj);
                pagedData.data.push(carRate);
            }
            pagedData.page = page;
            return pagedData;
        });
}



public saveDealerRating(postedData:any):Observable<any>{
    postedData['seller_id'] =  localStorage.getItem('loggedinUserId') ;
    return this.httpClient.post('car/saveDealerRating',postedData).map((response:any)=>response);

}

}
