// variabele met daarin alle stellingen van de stemwijzer
var currentAppScreenCount = 0;
var answers = [];
//0 = skip / 1 = oneens / 2 = geen van beide / 3 = eens
var choiceButtons = document.getElementsByClassName("choiceButton");
var partyExplanationListItems = document.getElementsByClassName("partyExplanationListItem");

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
        document.getElementById('importantStatementsCon').classList.remove('w3-hide');
        document.getElementById('nextBtn').onclick = function() {
            currentAppScreenCount++;
            setupVoteGuide(currentAppScreenCount);
        }
    } else if(position == (subjects.length + 1)) {
        document.getElementById('importantStatementsCon').classList.add('w3-hide');
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

function findParty(partiesArray, partyToFind) {
    return partiesArray.find(function(element) {
        return element.name == partyToFind;
    });
}

function calculateScore() {
    answers.forEach(function(currentElement, index){
        subjects[index].parties.forEach(function(element) {
            if (element.position == answers[index]) {
                console.log(element.name);
                findParty(parties, element.name).partyScore++;
            }
        });
    })
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


