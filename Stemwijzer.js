// variabele met daarin alle stellingen van de stemwijzer
var currentAppScreenCount = 0;
var answers = [];
var importantQuestions = [];
var importantParties = [];
//0 = skip / 1 = oneens / 2 = geen van beide / 3 = eens
var choiceButtons = document.getElementsByClassName("choiceButton");
var partyExplanationListItems = document.getElementsByClassName("partyExplanationListItem");
var importantPartiesCheckboxes = document.getElementsByClassName('importantPartiesCheckboxes');

function setupVoteGuide(position)  {
    if (position < subjects.length) {
        if (position == 0) {
            document.getElementById('statementsCon').classList.remove('w3-hide');
            document.getElementById('startBtn').classList.add('w3-hide');
        }
        document.getElementById("q").innerHTML = subjects[currentAppScreenCount].statement;
        document.getElementById("tQ").innerHTML = subjects[currentAppScreenCount].title;
    } else if(position == subjects.length) {
        document.getElementById('statementsCon').classList.add('w3-hide');
        subjects.forEach(function(element, index){
            iQ = document.createElement('LI');
            iQInput = document.createElement('INPUT');
            iQInput.className = "w3-check";
            iQInput.dataset.question = index;
            iQInput.onchange = function(){
                toggleElementInArray(this.dataset.question, importantQuestions);
            };
            iQInput.type = "checkbox";
            iQLabel = document.createElement('LABEL');
            iQLabel.innerText = element.title;
            iQ.appendChild(iQInput);
            iQ.appendChild(iQLabel);
            document.getElementById('iQList').appendChild(iQ);
        });
        document.getElementById('importantStatementsCon').classList.remove('w3-hide');
        document.getElementById('nextBtn').onclick = function() {
            currentAppScreenCount++;
            setupVoteGuide(currentAppScreenCount);
        }
    } else if(position == (subjects.length + 1)) {
        document.getElementById('importantStatementsCon').classList.add('w3-hide');
        parties.forEach(function(element, index){
            iP = document.createElement('LI');
            iPInput = document.createElement('INPUT');
            iPInput.className = "w3-check importantPartiesCheckboxes";
            iPInput.dataset.party = index;
            iPInput.dataset.secular = element.secular;
            iPInput.onchange = function(){
                toggleElementInArray(this.dataset.party, importantParties);
            };
            iPInput.type = "checkbox";
            iPLabel = document.createElement('LABEL');
            iPLabel.innerText = element.name;
            iP.appendChild(iPInput);
            iP.appendChild(iPLabel);
            document.getElementById('iPList').appendChild(iP);
        });
        document.getElementById('chosenPartiesCon').classList.remove('w3-hide');
        document.getElementById('finishBtn').onclick = function() {
            currentAppScreenCount++;
            setupVoteGuide(currentAppScreenCount)
        }
    } else if(position == (subjects.length + 2)) {
        document.getElementById('importantStatementsCon').classList.add('w3-hide');
        document.getElementById('chosenPartiesCon').classList.remove('w3-hide');
        document.getElementById('finishBtn').onclick = function() {
            currentAppScreenCount++;
        }
    }
}

function processChoice(choice) {
    if(choice == 0) {
        answers.push(0);
    } else if(choice == "contra") {
        answers.push("contra");
    } else if(choice == "ambivalent") {
        answers.push("ambivalent");
    } else if(choice == "pro") {
        answers.push("pro");
    }
    currentAppScreenCount++;
    setupVoteGuide(currentAppScreenCount);
}

// Zoekt de party waarbij de score omhoog moet
// De find()-methode geeft een waarde terug uit de array wanneer een element in de array aan de opgegeven testfunctie voldoet. In andere gevallen wordt undefined teruggegeven.
function findParty(partiesArray, partyToFind) {
    return partiesArray.find(function(element) {
        return element.name == partyToFind;
    });
}

// Kijkt voor elk antwoord of het overeenkomt met het antwoord van de gebruiker zoja dan word er een punt gegeven.
function calculateScore() {
    parties.forEach(function(currentElement){
        currentElement.partyScore = 0;
    });
    nswers.forEach(function(answersCurrentElement, answersIndex){
        subjects[answersIndex].parties.forEach(function(subjectsCurrentElement) {
            if (subjectsCurrentElement.position == answersCurrentElement) {
                var currentParty = findParty(parties, subjectsCurrentElement.name);
                currentParty.partyScore++;
                if(importantQuestions.indexOf(answersIndex.toString()) != -1) {
                    currentParty.partyScore++;
                }
            }
        });
    })
}

function ImportantQuestionScore() {

}

// als het element niet in de array staat word het gepusht. anders word het weg gehaald.
function toggleElementInArray(elm, array) {
    if(array.indexOf(elm) == -1){
        array.push(elm);
    } else {
        array.splice( array.indexOf(elm), 1 );
    }
}

function selectImportantPartiesCheckboxes(type) {
    Array.from(importantPartiesCheckboxes).forEach(function(element){
        if(type == "all") {
            if(element.checked == false) {
                element.checked = true;
                importantParties.push(element.dataset.party);
            }
        } else if(type == "none") {
            element.checked = false;
            importantParties = [];
        } else if(type == "secular") {
            if(element.dataset.secular == "true") {
                if(element.checked == false) {
                    element.checked = true;
                    importantParties.push(element.dataset.party);
                }
            } else {
                if (element.checked == true) {
                    element.checked = false;
                    importantParties.splice(importantParties.indexOf(element.dataset.party), 1);
                }
            }
        }
    });
}

function openPartyExplanation(elm) {
    elm.querySelector(".partyExplanation").classList.toggle("w3-hide");
}

Array.from(choiceButtons).forEach(function(element) {
    element.onclick = function() {
        processChoice(element.dataset.choice);
    }
});

Array.from(partyExplanationListItems).forEach(function(element) {
    element.onclick = function() {
        openPartyExplanation(element);
    }
});

document.getElementById('startBtn').onclick = function() {
    setupVoteGuide(0);
}





