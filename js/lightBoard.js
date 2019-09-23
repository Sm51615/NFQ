let clientList = JSON.parse(window.localStorage.getItem('clientList'));
let clientTime = JSON.parse(window.localStorage.getItem('clientTime'));

let clientListTable = document.querySelector('#client-info-table-body');
let distinctSpecialist;

window.addEventListener('storage', function() {
    location.reload();
});

distinctSpecialist = [...new Set(clientList.map(x => x.specialist))];

function clientListingString(distinctSpecialist, clientList, clientTime) {
    let clientArrayKey = 0;    
    let clientListingString = '';
    let timedArray; 

    timedArray = timeLeftCalculation(distinctSpecialist, clientList, clientTime);

    for(clientArrayKey; clientArrayKey < timedArray.length; clientArrayKey++) {
            clientListingString += '<tr>' +
            Object.values(timedArray[clientArrayKey]).map(function(clientDataValue) {

                    return '<td>' + clientDataValue + '</td>';
            }).join('') + '</tr>';
    }

    return clientListingString;
}

function unattendedClientList(clientList) {

    return clientList.filter(function(clientInfo) {

        return clientInfo.serviced == 0;
    });
}


function firstSpecialistRow(distinctValues, allValues) {
    let distinctValueKey = 0;
    let rowCellKey;
    let firstDistinctValueKey;
    let specialistRowNumber;
    let specialistRowSelector;
    let unattendedList;

    unattendedList = unattendedClientList(allValues);
    for(distinctValueKey;
        distinctValueKey < distinctValues.length;
        distinctValueKey++) {

        firstDistinctValueKey = unattendedList.findIndex(function(clientInfo) {
            
            if(clientInfo.specialist  == distinctValues[distinctValueKey] && clientInfo.serviced == 0) {
                return clientInfo;
            }
        });
        specialistRowNumber = firstDistinctValueKey + 1;
        specialistRowSelector = document.querySelectorAll(`tr:nth-child(${specialistRowNumber}) td`);

        for(rowCellKey = 0; rowCellKey < specialistRowSelector.length; rowCellKey++) {
            specialistRowSelector[rowCellKey].style.background = "#4ad44a";
        }
    }
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

function timeLeftCalculation(distinctSpecialist, clientList, clientTime) {
    let unattendedList; 
    let timeObject;
    let averageTime;
    let countedTime;
    let singleSpecialistArray;
    let timedArray = [];
    let coefficientKey;
    let startTime;
    
    unattendedList = unattendedClientList(clientList);
        for(let distinctKey in distinctSpecialist) {

            singleSpecialistArray = unattendedList.filter(
                function(clientInfo) {
 
                    return distinctSpecialist[distinctKey] == clientInfo.specialist
                }
            );

            
            timeObject = clientTime.find(function(specialist) {

                return distinctSpecialist[distinctKey] == specialist.specialist
            });

            averageTime = timeAverage(timeObject);
            startTime = timeObject.time;

            for(coefficientKey = 0; coefficientKey < singleSpecialistArray.length; coefficientKey++) {

                if(!isNaN(averageTime) || coefficientKey == 0) {
                    countedTime = timeConversion(averageTime, coefficientKey, startTime);
                }else {
                    countedTime = 'Laikas nežinomas'
                }

                timedObject = {
                    specialist: `${singleSpecialistArray[coefficientKey].specialist}`,
                    clientNumber: `${singleSpecialistArray[coefficientKey].clientNumber}`,
                    time: `${countedTime}`
                }
                timedArray.push(timedObject);
            }
        }
        
        return timedArray;
}

clientListTable.innerHTML = clientListingString(distinctSpecialist, clientList, clientTime);

firstSpecialistRow(distinctSpecialist, clientList);
