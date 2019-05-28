/**
 * A model for an individual corporate employee
 */
export class SellerRatingReview {
    _id: any;
    vehicle_year: any;
    vehicle_make: any;
    vehicle_model: any;
    created_on: Date;
    sold_date: Date;
    sold_to: any;
    rating_given: any;
    rating_received: any;




    constructor(object) {
        console.log('the car object is',object)
        this._id = object._id;
        this.vehicle_year = object.vehicle_year;
        this.vehicle_make = object.basic_info.vehicle_make;
        this.vehicle_model = object.basic_info.vehicle_model;
        this.created_on = object.created_at;
        this.sold_date = object.car_bids[0].bid_acceptance_date;
        this.sold_to = object.dealer[0].name.first_name;
        this.rating_given = object.review_by_seller.rating;
        this.rating_received = object.review_by_dealer.rating;
    }
}