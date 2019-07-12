import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

//modules services, models and enviornment file
import { TitleService, CarService, RealUpdateService, CommonUtilsService, DealerService } from '../../../../core/_services'
import { PagedData, Car, Page } from "../../../../core/_models";
import { environment } from '../../../../../environments/environment'
import { untilDestroyed } from 'ngx-take-until-destroy';// unsubscribe from observables when the component destroyed
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { isArray } from 'util';
declare let jQuery: any;
declare let $: any;
declare let POTENZA: any;

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ListingComponent implements OnInit {
  @ViewChild('listingTable') listingTable;
  @ViewChild('bidModal') bidModal: ElementRef;
  @ViewChild("listingSection") listingSection: ElementRef;

  sectionEnable: string = 'list'
  sliderOptions: NgxGalleryOptions[];
  sliderImages: NgxGalleryImage[];
  dealerShips: any = [];
  bidForm: FormGroup;
  legalContacts: any = [];
  car: any;
  page = new Page(); //object of Page type  
  cars = new Array<Car>() //array of Car type 
  seller: any;
  messages: any = [];
  users:any = [];
  isSubmitted:boolean = false;
  messageBody: any;
  selectedCarId: any;
  isBidListingModalOpen: boolean = false;
  submitted: boolean = false;
  currentPageLimit: number = environment.DEFAULT_RECORDS_LIMIT
  readonly pageLimitOptions = environment.DEFAULT_PAGE_LIMIT_OPTIONS
  private _defaultPagination = {
    count: 0,
    limit: this.currentPageLimit,
    offset: 0,
    pageSize: this.currentPageLimit
  }
  //title and breadcrumbs
  readonly title: string = 'Dealer Dashboard'
  readonly breadcrumbs: any[] = [{ page: 'Home', link: '/dealer/home' }, { page: 'Dashboard', link: '' }]


  constructor(private dealerService: DealerService, private realTimeUpdate: RealUpdateService, private commonUtilsService: CommonUtilsService, private carService: CarService, private formBuilder: FormBuilder, private titleService: TitleService) {

    this.page.type = 'all';
    //setting the page title

    this.realTimeUpdate.updateLsiting().subscribe(res => {
      this.loadRealTimeLsiting() // this willbe called after real time updation of listing
    })
  
    this.realTimeUpdate.updateUsers().subscribe(res => {
    this.users  = res;
    })
    

   this.realTimeUpdate.haveNewMessage().subscribe(res=>{
    $("#chatScroll").animate({ scrollTop: $(document).height() }, "slow");
     delete res['sendTo'];
     delete res['from'];
     let message = res;
     this.messages.push(message)
   });

    //update will be invoked on acception of bid from seller side
    this.realTimeUpdate.updateLsitingOnBidAcception().subscribe(res => {
      this.loadRealTimeLsiting() // this willbe called after real time updation of listing
    })


    this.titleService.setTitle();

    this.setPage(this._defaultPagination);
  }





 
  private dealerBidForm() {
    this.bidForm = this.formBuilder.group({
      car_id: [null, Validators.required],
      dealership_id: ['', [Validators.required]],
      legal_contact: ['', [Validators.required]],
      price: [null, [Validators.required, Validators.pattern(/^\d+$/)]]
    });
  }

  /**
   * it will be invoked for realtime data update
   */
  loadRealTimeLsiting() {
    this.page.pageNumber = this._defaultPagination.offset;
    this.page.size = this._defaultPagination.pageSize;


    //hit api to fetch data
    this.carService.listingDealersCars(this.page).pipe(untilDestroyed(this)).subscribe(

      //case success
      (pagedData) => {
        this.listingSection.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });//scroll the page to defined section #contentSection
        this.page = pagedData.page;

        //this.cars =  pagedData.data; 
        this.cars = [...pagedData.data];
        console.log('the cars are', this.cars)

        //case error 
      }, error => {
        this.commonUtilsService.onError(error);
      });



  }


  setPage(page) {

    this.page.pageNumber = page.offset;
    this.page.size = page.pageSize;

    this.commonUtilsService.showPageLoader();

    //hit api to fetch data
    this.carService.listingDealersCars(this.page).pipe(untilDestroyed(this)).subscribe(

      //case success
      (pagedData) => {
        this.listingSection.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });//scroll the page to defined section #contentSection
        this.page = pagedData.page;

        //this.cars =  pagedData.data; 
        this.cars = [...pagedData.data];
        console.log('the cars are', this.cars)

        this.commonUtilsService.hidePageLoader();
        //case error 
      }, error => {
        this.commonUtilsService.onError(error);
      });
  }

  show(type) {
    this.sectionEnable = type
    console.log('sectionEnable', this.sectionEnable);
  }




  showBids(carId): void {
    this.isBidListingModalOpen = true;
    this.selectedCarId = carId
  }

  /**
  * Reset modal popup to hide
  * @param isOpened    boolean value 
  * @return void
  */
  hide(isOpened: boolean): void {
    console.log(isOpened)
    this.isBidListingModalOpen = isOpened; //set to false which will reset modal to show on click again
    this.selectedCarId = '';
  }


  ngOnInit() {

    POTENZA.priceslider()
    POTENZA.yearslider()
    this.dealerBidForm();
    this.realTimeUpdate.saveUserOnSocketIo();
  }


  /**
     * Search results according to user inputs
     * @param searchValue user inputs to search particular data
     * @return  void
     */
  onSearch(searchValue: string): void {
    this.page.search = searchValue
    this.setPage(this._defaultPagination);
  }

  /**
  * To fetch the records according to type(All, Archive, Sold, Active)
  * @param type type of records(All, WishList, Hidden, Active)
  * @return  void
  */
  onChangeListType(type): void {
    this.page.type = type;
    this.page.totalElements = 0;
    this.setPage(this._defaultPagination);
  }


  /**
    * save the car in wishlist of the dealer 
    * @param $carId    carId is car id to hide the car
    */
  saveToWishList(carId: any) {

    this.carService.saveCarInWishList({ carId: carId }).pipe(untilDestroyed(this)).subscribe(response => {
      this.commonUtilsService.onSuccess('Your car has been moved to wishlist');
      this.setPage(this._defaultPagination);

    }, error => {
      this.commonUtilsService.onError(error)
    })

  };

  /**
    * move the car from wishlist of the dealer 
    * @param $carId    carId is car id to hide the car
    */
  moveFromWishList(carId: any) {

    this.carService.moveCarFromWishList({ carId: carId }).pipe(untilDestroyed(this)).subscribe(response => {
      this.commonUtilsService.onSuccess('Your car has been moved to wishlist');
      this.setPage(this._defaultPagination);

    }, error => {
      this.commonUtilsService.onError(error)
    })

  };



  /**
    * save the car in hide list
    * @param $carId    carId is car id to hide the car
    */
  hideCar(carId: any) {
    this.carService.hideCar({ carId: carId }).pipe(untilDestroyed(this)).subscribe(response => {
      this.commonUtilsService.onSuccess('Your car has been hidden');
      this.setPage(this._defaultPagination);
    }, error => {
      this.commonUtilsService.onError(error)
    })
  };



  /**
    * unhide the car in hide list
    * @param $carId    carId is car id to hide the car
    */
  unhideCar(carId: any) {
    this.carService.unhideCar({ carId: carId }).pipe(untilDestroyed(this)).subscribe(response => {
      this.commonUtilsService.onSuccess('Your car has been hidden');
      this.setPage(this._defaultPagination);
    }, error => {
      this.commonUtilsService.onError(error)
    })
  }



  /**
   * this will trigger when user hit the date filter 
   * @param value  is the date filters object
   */
  getDateFilter(value: any) {
    if (Object.keys(value).length === 0 && value.constructor === Object)
      this.page.filters = {};
    else
      this.page.filters['dates'] = value;

    this.setPage(this._defaultPagination);

  };


  /**place bid will open the placebid modal popup
   * @param car is the car object for bid
   *will return nothing
   */
  placeBid(car: any) {
    this.getAllDealShips();
    this.car = car;
    this.bidForm.patchValue({
      car_id: car._id
    })
    $(this.bidModal.nativeElement).modal({ backdrop: 'static', keyboard: false, show: true });
  }




  /**
   * get all dealer ships
   */
  getAllDealShips() {
    this.dealerService.getAllDealShips().pipe(untilDestroyed(this)).subscribe(response => {
      this.dealerShips = response;
    }, error => {
      this.commonUtilsService.onError(error);
    })

  }

  onSubmit() {
    this.submitted = true;
    console.log('the form is', this.bidForm);
    if (this.bidForm.invalid) return;

    this.confirmBid();

  }

  /**
   * 
   * place bid confirmation
   */

  private confirmBid(): void {
    Swal.fire({
      title: 'Are you sure you want to apply?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Apply!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {

        if (this.page.type == 'applied') {
          this.updateBid();//update bid if the dealer is loosing the bid
        } else {
          this.saveBid();//create bid 
        }



      }
    })

  }

  private saveBid() {
    this.dealerService.placeBid(this.bidForm.value).pipe(untilDestroyed(this)).subscribe(response => {
      this.commonUtilsService.onSuccess(environment.MESSAGES.BID_SUCCESS);
      this.realTimeUpdate.updateRealTimeData();
      this.bidForm.reset();
      this.submitted = false;

      $(this.bidModal.nativeElement).modal('hide');
      this.page.type = "applied";
      this.setPage(this._defaultPagination);
    }, error => {
      this.commonUtilsService.onError(error);
    })
  }


  private updateBid() {
    this.dealerService.updateBid(this.bidForm.value).pipe(untilDestroyed(this)).subscribe(response => {
      this.realTimeUpdate.updateRealTimeData();
      this.commonUtilsService.onSuccess(environment.MESSAGES.BID_SUCCESS);
      this.bidForm.reset();
      this.submitted = false;

      $(this.bidModal.nativeElement).modal('hide');
      this.page.type = "applied";
      this.setPage(this._defaultPagination);
    }, error => {
      this.commonUtilsService.onError(error);
    })
  }


  showChat(carId: any) {
    
    this.messages = [];
    this.dealerService.getChatDetails({ carId: carId }).subscribe(res => {
      let msgs = [];
      msgs = res.chat;
      this.messages = msgs.reverse();
      this.seller = res.seller;
      this.seller['isOnline'] = this.isInArray(this.seller.seller_id.username);
      console.log('the seller is ',this.seller)
      $(".chat_box").addClass("opend");
      $("#chatScroll").animate({ scrollTop: $(document).height() }, "slow");

    })

  }

  chat_close() {
    $(".chat_box").removeClass("opend");
  }

  /**
   * send message to seller
   */
  sendMessage() {
    if (!this.messageBody || this.isSubmitted) return
    this.isSubmitted = true;

    let message = {
      seller_id: this.seller.seller_id._id,
      messageBody: this.messageBody,
      isSeller: false,

    }
    this.dealerService.saveMessage(message).subscribe(res => {
      $("#chatScroll").animate({ scrollTop: $(document).height() }, "slow");
      this.messageBody = ''
      this.messages.push(res);
      let message = res;
      if(this.isInArray(this.seller.seller_id.username)){
        console.log('inside seller online section')
        message['sendTo']= this.users[this.users.map(user=>user.username).indexOf(this.seller.seller_id.username)]
        this.realTimeUpdate.sendMessage(message)
      }
      
      this.isSubmitted = false;
    },error=>{
      this.isSubmitted = false;
      console.log('something went wrong!!!!!!!!!!!')
    })
  }


  isInArray(value) {
    console.log(this.users)
    if(this.users.length){
      console.log(this.users)
      return this.users.map(user=>user.username).indexOf(value) > -1;
    }

    else false
  }
  /**after selecting the store assign legal contacts to legal contact array
   * @params value is the target value after selecting the dealership
   * return void
   */
  selectStore(value: any): void {
    let pos = this.dealerShips.map(e => e._id).indexOf(value);
    console.log(pos)
    if (pos >= 0) this.legalContacts = this.dealerShips[pos].legal_contacts;
    else this.legalContacts = [];
  }
  /**
   * Search results according to user inputs
   * @param searchValue user inputs to search particular data
   * @return  void
   */
  applyDashboardFilters(filters): void {
    this.page.filters = filters
    this.sectionEnable = 'list'
    console.log('filters', this.page.filters);
    this.setPage(this._defaultPagination);
  }




  /**
* To sort the records on dattable columns
* @param event event object which have column name and direction data
* @return  void
*/
  onSort(event) {

    const sort = event.sorts[0];
    this.page.sortProperty = sort.prop
    this.page.sortDirection = sort.dir
    this.setPage(this._defaultPagination);
  }

  /**
   * will invoke on the discard of the bid
   */
  finishFunction() {
    this.bidForm.reset();
    $(this.bidModal.nativeElement).modal('hide');
  }
  toggleExpandRow(row) {
    this.listingTable.rowDetail.toggleExpandRow(row);
  }


  onDetailToggle(event) {
  }
  ngOnDestroy() {

  }


}
