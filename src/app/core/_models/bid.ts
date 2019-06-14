/**
 * A model for an individual corporate employee
 */
export class Bid {
    // car_id:any;
    dealer_name:any;
    bid_date:Date;
    buyer_rating:any;
    price:number;




constructor(object){
    
    if(object && object.dealer_id && object.dealer_id.name)
    this.dealer_name=object.dealer_id.name.prefix+' '+object.dealer_id.name.first_name +' '+object.dealer_id.name.last_name;
    // this.buyer_rating = object.dealer_id.rating;
    this.buyer_rating = 2.5;
    this.bid_date = object.bid_date;
    this.price  = object.price;
}
}