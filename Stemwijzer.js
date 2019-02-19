/*globals subjects, parties, iQ, iQInput, iQLabel*/
// variabele met daarin alle stellingen van de stemwijzer
var currentAppScreenCount = 0;
var answers = [];
var importantQuestions = [];
var importantParties = [];
//0 = skip / 1 = oneens / 2 = geen van beide / 3 = eens
var choiceButtons = document.getElementsByClassName("choiceButton");
var partyExplanationListItems = document.getElementsByClassName("partyExplanationListItem");
var importantPartiesCheckboxes = document.getElementsByClassName('importantPartiesCheckboxes');

function bColorWhite()
{
    document.body.style.backgroundColor = "white";
}

function bColorRed()
{
    document.body.style.backgroundColor = "#9e9e9e";
}

function bColorGreen()
{
    document.body.style.backgroundColor = "#87CEEB";
}

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
        };
    } else if(position == (subjects.length + 1)) {//important parties
        document.getElementById('importantStatementsCon').classList.add('w3-hide');
        parties.forEach(function(element, index){
            iP = document.createElement('LI');
            iPInput = document.createElement('INPUT');
            iPInput.className = "w3-check importantPartiesCheckboxes";
            iPInput.dataset.party = element.name;
            iPInput.dataset.secular = element.secular;
            iPInput.onchange = function(){
                toggleImportantParty(this.dataset.party);
            };
            iPInput.type = "checkbox";
            iPLabel = document.createElement('LABEL');
            iPLabel.innerText = element.name;
            iP.appendChild(iPInput);
            iP.appendChild(iPLabel);
            document.getElementById('iPList').appendChild(iP);
        });
        document.getElementById('importantPartiesCon').classList.remove('w3-hide');
        document.getElementById('finishBtn').onclick = function() {
            currentAppScreenCount++;
            setupVoteGuide(currentAppScreenCount);
        };
    } else if(position == (subjects.length + 2)) {//result
        document.getElementById('importantPartiesCon').classList.add('w3-hide');
        document.getElementById('partiesResults').classList.remove('w3-hide');
		calculateScore();
        parties.sort(function(a, b) {
            return parseFloat(b.partyScore) - parseFloat(a.partyScore);
        });
		parties.forEach(function(element, index){
		    if (element.important === true) {
                var partyResultsScoreCon = document.createElement("DIV");
                partyResultsScoreCon.className = "partyResultsScoreCon";
                var partyResultsScoreConTitle = document.createElement("H3");
                partyResultsScoreConTitle.innerText = element.name;
                var progressBarCon = document.createElement("DIV");
                progressBarCon.className = "w3-light-grey progressBarCon";
                var progressBar = document.createElement("DIV");
                if (document.getElementsByClassName('progressBarCon').length < 3) {
                    progressBar.className = "w3-green w3-center";
                } else {
                    progressBar.className = "w3-grey w3-center";
                }
                progressBar.style.width = element.partyScorePercentage + "%";
                progressBar.innerText = element.partyScorePercentage + "%";
                partyResultsScoreCon.appendChild(partyResultsScoreConTitle);
                progressBarCon.appendChild(progressBar);
                partyResultsScoreCon.appendChild(progressBarCon);
                document.getElementById('partiesResultsScoresCon').appendChild(partyResultsScoreCon);
                document.getElementById('Alert').classList.remove('w3-hide');
            }
		});
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
    console.log("Keuze verwerkt.");
}

// Zoekt de party waarbij de score omhoog moet
// De find()-methode geeft een waarde terug uit de array wanneer een element in de array aan de opgegeven testfunctie voldoet. In andere gevallen wordt undefined teruggegeven.
function findParty(partiesArray, partyToFind) {
    return partiesArray.find(function(element) {
        return element.name == partyToFind;
        console.log("Party gevonden.");
    });
}

// Kijkt voor elk antwoord of het overeenkomt met het antwoord van de gebruiker zoja dan word er een punt gegeven.
function calculateScore() {
    parties.forEach(function(currentElement){
        currentElement.partyScore = 0;
        currentElement.partyScorePercentage = 0;
    });
    answers.forEach(function(answersCurrentElement, answersIndex){
        subjects[answersIndex].parties.forEach(function(subjectsCurrentElement) {
            if (subjectsCurrentElement.position == answersCurrentElement) {
                var currentParty = findParty(parties, subjectsCurrentElement.name);
                currentParty.partyScore++;
                console.log("Punt uitgedeeld");
                if(importantQuestions.indexOf(answersIndex.toString()) != -1) {
                    currentParty.partyScore++;
                    console.log("Extra punt uitgedeeld");
                }
            }
        });
    });
	parties.forEach(function (element) {
		element.partyScorePercentage = Math.round(element.partyScore * 100 / (answers.length + importantQuestions.length))
        console.log("Resultaat berekent.");
	});
}

// als het element niet in de array staat word het gepusht. anders word het weg gehaald.
function toggleElementInArray(elm, array) {
    if(array.indexOf(elm) == -1){
        array.push(elm);
    } else {
        array.splice( array.indexOf(elm), 1 );
    }
}

function toggleImportantParty(party) {
    let currentParty = findParty(parties, party);
    if (currentParty.important == false) {
        currentParty.important = true;
    } else {
        currentParty.important = false;
    }
}

function selectImportantPartiesCheckboxes(type) {
    Array.from(importantPartiesCheckboxes).forEach(function(element){
        if(type == "all") {
            var currentParty = findParty(parties, element.dataset.party);
            if(element.checked == false) {
                element.checked = true;
                currentParty.important = true;
                console.log("Alle parties geselecteerd");
            }
        } else if(type == "none") {
            element.checked = false;
            parties.forEach(function (currentValue) {
                currentValue.important = false;
                console.log("Alle parties weg gehaald.");
            });
        } else if(type == "secular") {
            var currentParty = findParty(parties, element.dataset.party);
            if(element.dataset.secular == "true") {
                parties.forEach(function (currentValue) {
                    if (currentValue.secular == true) {
                        currentValue.important = true;
                        console.log("Belangrijke party aangegeven.");
                    } else {
                        currentValue.important = false;
                    }
                });
                if(element.checked == false) {
                    element.checked = true;
                }
            } else {
                if (element.checked == true) {
                    element.checked = false;
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
    };
});

Array.from(partyExplanationListItems).forEach(function(element) {
    element.onclick = function() {
        openPartyExplanation(element);
    };
});

document.getElementById('startBtn').onclick = function() {
    setupVoteGuide(0);
};