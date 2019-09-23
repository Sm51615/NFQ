let clientList = JSON.parse(window.localStorage.getItem('clientList'));
let clientTime = JSON.parse(window.localStorage.getItem('clientTime'));

let distinctSpecialist = [...new Set(clientList.map(x => x.specialist))];
let specialistSelection = document.querySelector('#specialist-selection');
let filtratedSpecialistList = document.querySelector('#chosen-specialist-clients');
let currentClient = document.querySelector('#current-client');
let servicedClientButton = document.querySelector('#serviced-client-button');

function specialistSelectOptions(specialistList, specialistSelectionDOM) {
    let specialistKey = 0;

    for(specialistKey; specialistKey < specialistList.length; specialistKey++) {
        specialistSelectionDOM.options[specialistSelectionDOM.options.length] = new Option(
            specialistList[specialistKey], specialistKey);
    }
};  

function clientFiltration(valueFiltratedBy, dataToFiltrate) {
    let filtratedClients = dataToFiltrate.filter(function(client) {
        return client.specialist == valueFiltratedBy && client.serviced == 0;
    });

    let clientsNumbers = filtratedClients.map(function(client) {
        return client.clientNumber;
    });

    return clientsNumbers
}

specialistSelectOptions(distinctSpecialist, specialistSelection);

specialistSelection.addEventListener("click", function() {
    let clientsNumberKey = 0;
    let firstKeyOfClients = 0;
    let chosenSpecialist = this.options[this.selectedIndex].text;
    let clientsNumbers;

    clientsNumbers = clientFiltration(
        chosenSpecialist,
        clientList
    );

    filtratedSpecialistList.innerHTML = "";
    for(clientsNumberKey; clientsNumberKey < clientsNumbers.length; clientsNumberKey++) {
        filtratedSpecialistList.innerHTML += `<br> ${clientsNumbers[clientsNumberKey]}`;
    }
    
    currentClient.innerHTML = "";
    if(clientsNumbers[firstKeyOfClients] !== undefined) {
        currentClient.innerHTML = clientsNumbers[firstKeyOfClients];
    }
});


function serviceTime(clientsTime, specialist) {

    let startTime;
    let endTime;
    let timeArrayKey = 0;
    let serviceTime;

    endTime = Date.now();

    for(timeArrayKey; timeArrayKey < clientsTime.length; timeArrayKey++) {
        if(clientsTime[timeArrayKey].specialist == specialist) {
            startTime = clientsTime[timeArrayKey].time;
            serviceTime = endTime - startTime;
            clientsTime[timeArrayKey].time = endTime;
            clientsTime[timeArrayKey].totalTime += serviceTime;
            clientsTime[timeArrayKey].servedClientAmount += 1;
        }
        console.log(endTime);
        console.log(startTime);
        console.log(serviceTime);
    }

    return clientsTime;
}

servicedClientButton.addEventListener("click", function() {
    let changedServiceStatus 
    let currentClientNumber = document.getElementById("current-client").innerHTML;
    let servedClientList;
    let serializedClientList;
    let servicedTime;
    let clientArrayKey = 0;

    for(clientArrayKey; clientArrayKey < clientList.length; clientArrayKey++) {
        if(clientList[clientArrayKey].clientNumber == currentClientNumber) {

            clientList[clientArrayKey].serviced = 1;
            servicedTime = serviceTime(clientTime, clientList[clientArrayKey].specialist);
            serializedClientTime = JSON.stringify(servicedTime);
            window.localStorage.setItem('clientTime', serializedClientTime);

        }
    }

    serializedClientList = JSON.stringify(clientList);
    window.localStorage.setItem('clientList', serializedClientList);

});

window.addEventListener('storage', function() {
    location.reload();
});

console.log(clientList);
console.log(clientTime);




