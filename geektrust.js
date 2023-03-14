const fs = require("fs")
const metroCard = require('./metroCard');
const station = require('./station')

var fileName = process.argv.slice(2)[0];
fs.readFile(fileName, "utf8", (err, data) => {
    if (err) {
        console.log("Error in reading input files");
        return ;
    }
    var inputLines = data.toString().split("\n")
    calculate(inputLines);
})

function search(cardNumber,cards){
    for(let card of cards){
        if(card.cardNumber==cardNumber){
            return card
        }
    }
    return null;
}

function calculate(inputLines){
    let metroCards=[];
    const central = new station('CENTRAL');
    const airport = new station('AIRPORT');
    for(let line of inputLines){
        const parameters = line.replace(/(\r\n|\n|\r)/gm,"").split(' ');
        const task = parameters[0];
        switch(task){
            case 'BALANCE':{
                let cardNumber = parameters[1];
                let searchedCard = search(cardNumber,metroCards);
                if(searchedCard==null){
                    metroCards.push(new metroCard(parameters[1],parseInt(parameters[2])));
                }else{
                    searchedCard.balance+=parseInt(parameters[2]);
                }
                break;
                }
            case 'CHECK_IN':{
                let cardNumber = parameters[1];
                let searchedCard = search(cardNumber,metroCards);
                let currentStation = parameters[3];
                switch(currentStation){
                    case 'CENTRAL':{
                        if(central.tickets.has(searchedCard.cardNumber)){
                            central.totalCollection+=searchedCard.deductBalance(central.fare[parameters[2]],true);
                            central.totalDiscount+=(0.5*central.fare[parameters[2]]);
                            central.tickets.delete(searchedCard.cardNumber);
                        }else{
                            airport.tickets.add(searchedCard.cardNumber);
                            central.totalCollection+=searchedCard.deductBalance(central.fare[parameters[2]],false);
                        }
                        central.passengers[parameters[2]]++;
                        break;
                    }
                    case 'AIRPORT':{
                        if(airport.tickets.has(searchedCard.cardNumber)){
                            airport.totalCollection+=searchedCard.deductBalance(airport.fare[parameters[2]],true);
                            airport.totalDiscount+=(0.5*airport.fare[parameters[2]]);
                            airport.tickets.delete(searchedCard.cardNumber);
                        }else{
                            central.tickets.add(searchedCard.cardNumber);
                            airport.totalCollection+=searchedCard.deductBalance(airport.fare[parameters[2]],false);
                        }
                        airport.passengers[parameters[2]]++;
                        break;
                    }
                }
                break;
            }
            case 'PRINT_SUMMARY':{
                console.log('TOTAL_COLLECTION CENTRAL '+central.totalCollection+' '+ central.totalDiscount);
                console.log('PASSENGER_TYPE_SUMMARY');
                let keysSorted = Object.keys(central.passengers).sort(function(a,b){return central.passengers[b]-central.passengers[a]})
                if((central.passengers['KID']==central.passengers['ADULT']) && (central.passengers['KID']==central.passengers['SENIOR_CITIZEN'])){
                    console.log('ADULT '+central.passengers['ADULT']);
                    console.log('KID '+central.passengers['KID']);
                    console.log('SENIOR_CITIZEN '+central.passengers['SENIOR_CITIZEN']);
                }else{   
                    for(const key of keysSorted){
                         if(central.passengers[key]!=0)
                         console.log(key+' '+central.passengers[key]);
                    }
                }
                console.log('TOTAL_COLLECTION AIRPORT '+airport.totalCollection+' '+ airport.totalDiscount);
                console.log('PASSENGER_TYPE_SUMMARY');
                keysSorted = Object.keys(airport.passengers).sort(function(a,b){return airport.passengers[b]-airport.passengers[a]})
                if((airport.passengers['KID']==airport.passengers['ADULT']) && (airport.passengers['KID']==airport.passengers['SENIOR_CITIZEN'])){
                    console.log('ADULT '+airport.passengers['ADULT']);
                    console.log('KID '+airport.passengers['KID']);
                    console.log('SENIOR_CITIZEN '+airport.passengers['SENIOR_CITIZEN']);
                }else{   
                    for(const key of keysSorted){
                         if(airport.passengers[key]!=0)
                         console.log(key+' '+airport.passengers[key]);
                    }
                }
                break;        
            }    
        }
    }
}
