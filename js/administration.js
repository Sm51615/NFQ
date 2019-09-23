let submittedJSONList = document.querySelector('#JSON-file-submission');
let defaultJSONList = document.querySelector('#JSON-default-file-submission');
let clientList = JSON.parse(window.localStorage.getItem('clientList'));
let clientTimeString = document.querySelector('#successful-client-registration');
let clientRegistrationMessage = document.querySelector('#registration-message');
let JSONErrorMessage = document.querySelector('#JSON-file-not-found');

function compareAlgorithm (firstValue, secondValue) {

    if (firstValue > secondValue) return +1;
    if (firstValue < secondValue) return -1;

    return 0;
};

function sortBySpecialist(clientList) {

    clientList.sort(function (firstValue, secondValue) {

        return (compareAlgorithm(firstValue.specialist, secondValue.specialist) 
            || compareAlgorithm(firstValue.clientNumber, secondValue.clientNumber)
        );
    });
}

function specialistServiceTimeStart(clientFile) {
    let distinctSpecialist;
    let specialistKey = 0;
    let clientTime = [];
    let startTime;

    startTime = Date.now();
    distinctSpecialist = [...new Set(clientFile.map(x => x.specialist))];
    
    for(specialistKey; specialistKey < distinctSpecialist.length; specialistKey++) {
        clientTime[specialistKey] = {
            specialist: `${distinctSpecialist[specialistKey]}`,
            time: startTime,
            servedClientAmount: 0,
            totalTime: 0
        };
        console.log(clientTime[specialistKey]);
    }
    return clientTime;
}


function gettingClientList() {
    event.preventDefault();
    let administrationHref = window.location.href;
    let serializedClientList;
    let serializedClientTime;
    let JSONClientListPath;

    JSONClientListPath = administrationHref.replace(
        "html/administration.html", 'json/users.json'
        );

    
    fetch(JSONClientListPath)
        .then(function(response) {
            return response.json();
        })
        .then(function(clientJSON) {
            sortBySpecialist(clientJSON);
            serializedClientList = JSON.stringify(clientJSON);
            serializedClientTime = JSON.stringify(
                specialistServiceTimeStart(clientJSON)
            )
            window.localStorage.setItem('clientList', serializedClientList);
            window.localStorage.setItem('clientTime', serializedClientTime);
        })
        .catch(function(err) {
            console.log('Nepavyko nuskaityti lankytojų duomenų');
            JSONErrorMessage.innerHTML = "Nepavyko nuskaityti lankytojų duomenų <br><br>";
        });
}

function newClient() {
    let highestNumber
    let nextNumber;
    let newClientObject;
    let chosenSpecialist = document.querySelector('#chosen-specialist').value;

    document.getElementById("chosen-specialist").focus();
    if(chosenSpecialist == "") {
        return clientRegistrationMessage.innerHTML = '<br>' + 'Įrašykite norimą specialistą';
    }

    if(clientList) {
        highestNumber = Math.max.apply(
            Math,clientList.map(function(clientObject){
                return clientObject.clientNumber;
            })
        );
            
        nextNumber = highestNumber + 1;

        newClientObject = {
            specialist: `${chosenSpecialist}`,
            clientNumber: `${nextNumber}`,
            serviced: 0
        };

        clientList.push(newClientObject);

            sortBySpecialist(clientList);
            serializedClientList = JSON.stringify(clientList);
            serializedClientTime = JSON.stringify(
                specialistServiceTimeStart(clientList)
            );
            window.localStorage.setItem('clientList', serializedClientList);
            window.localStorage.setItem('clientTime', serializedClientTime);


        return clientRegistrationMessage.innerHTML = 
            `<br> Klientas sėkmingai užregistruotas <br> Nr ${nextNumber}`;
    }
}

defaultJSONList.addEventListener('submit', gettingClientList);



