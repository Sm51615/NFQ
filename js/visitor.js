let specialistTime = JSON.parse(window.localStorage.getItem('clientTime'));
let clientList = JSON.parse(window.localStorage.getItem('clientList'));
let invidualClientNumber = window.localStorage.getItem('invidualClientNumber');
let clientTimeString = document.querySelector('#client-time-string');


function refreshTime() {
    if(invidualClientNumber) {
        numberHandling(invidualClientNumber);
    }
}

refreshTime();

function numberHandling(
    savedClientNumber, 
    clientNumberDOM = document.querySelector('#client-number').value
) {

    let startTime;
    let indexOfClientTimeArray;
    let averageTime;
    let unattendedList;
    let individualTime;
    let firstKeyOfArray = 0;
    let singleSpecialistArray;
    let numberClientSpecialist;
    let individualClientInfo;

    if(savedClientNumber) {
        clientNumberDOM = savedClientNumber;
    }

    if(!isNaN(clientNumberDOM)) {

        return clientTimeString.innerHTML = '<br>' + 'Numeris turi būti skaičius';
    }

    unattendedList = unattendedClientList(clientList);

    numberClientSpecialist = unattendedList.find(function(clientInfo) {

        return  clientNumberDOM == clientInfo.clientNumber;
    });

    startTimeObject = specialistTime.find(function(clientInfo) {

        return  numberClientSpecialist.specialist == clientInfo.specialist;
    });
    
    singleSpecialistArray = unattendedList.filter(
        function(clientInfo) {

            return numberClientSpecialist.specialist == clientInfo.specialist
        }
    );

    indexOfClientTimeArray = singleSpecialistArray.findIndex(function(clientInfo) {

        return clientInfo.clientNumber == clientNumberDOM;
    });

    if(indexOfClientTimeArray == -1) {

        return "Client number doesn't exist"
    }

    specialistTimeObject = specialistTime.filter(function(specialist) {

        return specialist.specialist ==
        singleSpecialistArray[indexOfClientTimeArray].specialist;
    });

    averageTime = timeAverage(specialistTimeObject[firstKeyOfArray]);

    individualTime = timeConversion(
        averageTime, indexOfClientTimeArray, startTimeObject.time
    );

    if(individualTime == "NaN h NaN min NaN s") {
        individualTime = 'Laikas nežinomas';
    }
    clientTimeString.innerHTML = '<br>' + individualTime;
    window.localStorage.setItem('invidualClientNumber', clientNumberDOM);
}


function timeAverage(clientTimeObject) {
    let timeAverage;
    let userAmount;
    let timeSum;

    timeSum = clientTimeObject.totalTime;
    userAmount = clientTimeObject.servedClientAmount;

    return timeAverage = timeSum/userAmount;
}

function doubleDigitTime(time) {

    return (time < 10) ? "0" + time : time; 
} 

function timeConversion(averageTime, arrayKey, startTime) {
    let coefficient = arrayKey - 1;
    let millisecondsInHour = 3600000;
    let millisecondsInMinute = 60000;
    let millisecondsInSecond = 1000;
    let convertedTime;
    let currentTime =  Date.now(); 
    let timePassed;
    let timeLeft;

    if(coefficient < 0) {

        return 'Dabar aptarnaujamas'
    }

    timePassed = currentTime - startTime;
    timeLeft = averageTime - timePassed;
    convertedTime = timeLeft + averageTime * coefficient;

    if(convertedTime <= 0) {

        return 'Netrukus jūsų vizitas'
    }
    console.log(timePassed);
    console.log(timeLeft);
    console.log(convertedTime);
    return doubleDigitTime(
                Math.floor(convertedTime / millisecondsInHour)
            ) + " h " +
            doubleDigitTime(
                Math.floor((convertedTime / millisecondsInMinute) % 60)
            ) + " min " +
            doubleDigitTime(
                Math.floor((convertedTime /  millisecondsInSecond) % 60)
            ) + " s";
}

function unattendedClientList(clientList) {

    return clientList.filter(function(clientInfo) {

        return clientInfo.serviced == 0;
    });
}
