import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient} from '@angular/common/http';
import 'rxjs/add/observable/of';
import { PagedData,Purchase, Page } from "../../core/_models";

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

    //page['seller_id'] = localStorage.getItem('loggedinUserId') 
    page['dealer_id'] = '5cd3c98149e7031d35d1f343'
    return this.httpClient.post('dealer/getPurchaseList', page)
        .map((response: any) =>{
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

}
