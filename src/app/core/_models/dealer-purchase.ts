/**
 * A model for an individual corporate employee
 */
export class Purchase {
           car_id:any;
           dealer_id:any;
           price:number;
           bid_date:Date;
           bid_acceptance:string;
           bid_acceptance_date:Date;
           time:{};
           fee_status:string;
           updated_by:any;




  constructor(object){
    this.car_id = object.car_id;
    this.dealer_id=object.dealer_id;
    this.price  = object.price;
    this.bid_date = object.bid_date;
    this.bid_acceptance = object.bid_acceptance;
    this.bid_acceptance_date= object.bid_acceptance_date;
    this.time = object.time;
    this.fee_status = object.fee_status;
    this.updated_by = object.updated_by;
    }
}