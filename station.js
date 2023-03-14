module.exports = class station{
    constructor(stationName){
        this.stationName = stationName;
        this.passengers = {
            'ADULT':0,
            'SENIOR_CITIZEN':0,
            'KID': 0
        }
        this.fare = Object.freeze({
            'ADULT': 200,
            'SENIOR_CITIZEN': 100,
            'KID': 50
          });
        this.totalCollection=0;
        this.totalDiscount=0;  
        this.tickets = new Set();
    }
}