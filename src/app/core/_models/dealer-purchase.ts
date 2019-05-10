/**
 * A model for an individual corporate employee
 */
export class Purchase {
           car_id:any;
           bid_date:Date;
           bid_acceptance_date:Date;
           price:number;
           contact:any;
           fee_status:string;




  constructor(object){
    this.car_id = object.car_id;
    this.bid_date = object.bid_date;
    this.bid_acceptance_date= object.bid_acceptance_date;
    this.price  = object.price;
    this.contact=object.dealer_id.name.prefix+' '+object.dealer_id.name.first_name +' '+object.dealer_id.name.last_name;
    this.fee_status = object.fee_status;
    }
}