module.exports = class metroCard {
    constructor(cardNumber, balance){
        this.cardNumber = cardNumber;
        this.balance = parseInt(balance);
    }
    // WRITE COMMENTS 
    // error handling
    // meaning variable names
    // restrict max lines single functions
    // open ai 
    deductBalance(balance,returnFare){
        balance = parseInt(balance)
        let totalBalance = 0;
        let serviceCharge = 0;
        if(returnFare){
            balance = 0.5*balance;
        }
        if(balance>this.balance){
            totalBalance+=balance;
            serviceCharge = 0.02*(balance-this.balance);
            totalBalance+=serviceCharge;
            this.balance = 0;
        }else{
            totalBalance +=balance;
            this.balance-=balance;
        }
        return totalBalance;
    }
}

