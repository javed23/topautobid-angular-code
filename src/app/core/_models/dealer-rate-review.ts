/**
 * A model for an individual corporate employee
 */
export class DealerRatingReview {
    _id: any;
    vehicle_year: any;
    vehicle_make: any;
    vehicle_model: any;
    created_on: Date;
    purchase_date: Date;
    purchase_from: any;
    seller_id:any;
    rating_given: any;
    rating_received: any;
    review_given:any;
    review_received:any;
    price:any;




    constructor(object) {
        this._id = object._id;
        this.vehicle_year = object.vehicle_year;
        this.vehicle_make = object.basic_info.vehicle_make;
        this.vehicle_model = object.basic_info.vehicle_model;
        this.created_on = object.created_at;
        this.purchase_date = object.car_bids[0].bid_acceptance_date;
        this.purchase_from = object.seller[0].name.first_name;
        this.seller_id = object.seller[0]._id;
        this.rating_received =object.dealer_ratings.length > 0?object.dealer_ratings[0].rating:0;
        this.review_received = object.dealer_ratings.length > 0?object.dealer_ratings[0].review:'';
        this.rating_given = object.seller_ratings.length > 0? object.seller_ratings[0].rating :0;
        this.review_given = object.seller_ratings.length > 0 ? object.seller_ratings[0].review:'';
        this.price = object.car_bids[0].price;
    }
}