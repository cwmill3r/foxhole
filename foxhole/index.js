// Globals
let userInfo = undefined;
let surveyQuestions = undefined;
let employees = undefined;
let unrespondedSurveys = undefined;
let surveyToTake = undefined;

// content panels used in hiding showing
const contentPanels = [
  'homeTab',
  'accountTab',
  'surveyTab',
  'manageTab',
  'responseTab',
  'createQuestionTab'
];
 
// login form submit handler
function handleLoginFormSubmit(e) {
  e.preventDefault();
  const id = document.querySelector('#userName').value;
  const pass = document.querySelector('#pswr').value;
  LogOn(id, pass);
  console.log(userInfo);
  //
}

function clearLogOnForm() {
  document.querySelector('#userName').value = "";
  document.querySelector('#pswr').value = "";
}

function renderHomePage() {
  document.querySelector('#homeTab').innerHTML = 
    ` <h2 class="w3-margin w3-text-indigo">Hi there!</h2>
      <h2 class="w3-margin w3-text-indigo">Welcome to Foxhole</h2>
      <img src="https://openclipart.org/download/279046/Cute-Fox-Without-Background.svg" />
      <button class="w3-button w3-indigo w3-padding-large w3-large w3-margin-top" onclick="document.getElementById('loginModal').style.display='block'" style="width:auto;">Login</button>`;
}

function renderAccountManagementPage() {
  if (userInfo.admin ==1) {
    document.querySelector('#manageTab').innerHTML =
      `<div class="w3-container">
        <h3 class="w3-text-teal">Accounts currently registered with Foxhole</h2>
        <div class="w3-right">
          <button onclick="renderAccountPage(userInfo)" id="returnButton">Return to your Account</button>
        </div>
       </div>
       <br>`
       GetAccounts();
       showPanel('manageTab');
  } else {
      window.alert('Not an authorized user');
  }      

}

function renderAccountPage(userInfo) {
  if (userInfo.admin == 1) {
    // show admin account page
    document.querySelector('#accountTab').innerHTML =
      `<div class="w3-container">
        <img src="http://i.pravatar.cc/300" class="w3-bar-item w3-circle w3-hide-small" style="width:85px">
        <h3 class="w3-text-teal">hello ${userInfo.userName}</h3>
        <a style="text-decoration: underline; cursor: pointer;" class="w3-text-indigo" onClick="renderAccountManagementPage()" id="manageAccount-button">Manage Accounts</a>
        <a style="text-decoration: underline; cursor: pointer;" class="w3-text-indigo" onClick="handleLogoffClick()" id="logoff-button">Logoff</a>
        <div class="w3-right">
          <button onclick="handleCreateSurveyClick(this)" id="createSurveyButton">create new survey</button>
        </div>
      </div>
      <div id="surveyContainer"></div>
      <div class="w3-container">
        <div class="w3-section">
          <ul id="userSurveyList" class="w3-ul w3-card-4 w3-white"></ul>
        </div>
      </div>
      </br>`
    // render the surveys that an employee has not yet responded to

    GetUnrespondedSurveys(userInfo.eID);
    sleep(5000).then(() => {
      renderUnrespondedSurveys();
      
      // then render the questions
    })
   
    // render the questions that the user created
    //GetUserSurveys(userInfo.id);
  } else {
    // show pleb account

  }

  // show the rendered page
  showPanel('accountTab');
}

function renderUnrespondedSurveys() {
  alert('Hello from unresponded survey thing...speed up for production');
  console.log(unrespondedSurveys);
  document.querySelector('#surveyContainer').innerHTML += `<h3>Unresponded Surveys</h3>`;
  unrespondedSurveys.map(function (survey) {
    console.log(survey);
    document.querySelector('#userSurveyList').innerHTML +=
      `<li class="w3-bar">
        <span data-sID=${survey.sID} onClick="renderUserResponsePage(this)" class="takeSurveyButton w3-bar-item w3-button w3-xlarge w3-right">
          <i class="fa fa-reply"></i>
          <p class="takeSurveyButton w3-small">Take Survey</p>
        </span>
   
        <div class="w3-bar-item">
          <span class="w3-large w3-text-grey"> ${survey.questionText} </span><br>
          <span class="w3-large w3-text-grey"> ${survey.date} </span><br>
        </div>
      </li>`
  });
}

function handleLogoffClick() {
  LogOff();
  renderHomePage();
  showPanel('homeTab');
}

function handleCreateSurveyClick() {
  window.alert('create survey clicked');
  renderSurveyPage();
  showPanel('surveyTab');
}

function renderSurveyPage() {
  GetSurveyQuestions();
  document.querySelector('#accountTab').style.height = "0px";
  console.log(surveyQuestions);
  GetAccounts();
  sleep(5000).then(() => {
    //const sQuestions = GetSurveyQuestions();
    console.log(surveyQuestions);
    const questionContainer = document.querySelector('#questionContainer');

    surveyQuestions.map(function (question) {
      console.log(question.text);
      questionContainer.innerHTML += `<option data-qID=${question.qID} value="example1">${question.text}</option>`;
    });

    const employeeContainer = document.querySelector('#employeeContainer');
    console.log(employees);
    employees.map(function (employee) {
      employeeContainer.innerHTML += `<option data-eID=${employee.eID}">${employee.email}</option>`;
    });
  });


  //surveyQuestions.map(function (question) {
  //  questionContainer.innerHTML = question.questionText;
  //})
  
}

function handleUserResponseSubmit(e) {
  e.preventDefault;
  console.log(e);
  alert('response form submitted');

  // qID, privacy, asking_eID, date, int[] recipient_eID
  let qID = getSelectedQuestion();
  let privacy = undefined;
  if (document.querySelector('#anonymous').checked) {
    privacy = 1;
  } else {
    privacy =0
  }
  let asking_eID = employees[0].eID;
  let d = new Date();
  let datestring = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  console.log(datestring);

  let recipients = getSelectedEmployees();
  console.log(qID, privacy, asking_eID, datestring, recipients[0]);

  let surveyID = CreateSurvey(qID, privacy, asking_eID, datestring); // add recipients array back in after testing
  console.log(surveyID);
}

// returns the recipients as array of ints to be consumed by the CreateSurvey() service
function getSelectedQuestion() {
  let questionContainer = document.getElementById('questionContainer'), question, i;
  let selectedQuestion = undefined;

  for (i = 0; i < questionContainer.length; i++) {
    question = questionContainer.options[i];
    if (question.selected) {
      console.log(question);
      let selectedQID = questionContainer.options[i].getAttribute("data-qid");
      selectedQID = parseInt(selectedQID);
      console.log(selectedQID);
      selectedQuestion = selectedQID;
    }
  }
  return selectedQuestion;
}

// returns the recipients as array of ints to be consumed by the CreateSurvey() service
function getSelectedEmployees() {
  let employeeContainer = document.getElementById('employeeContainer'), employee, i;
  let employeeArray = [];

  for (i = 0; i < employeeContainer.length; i++) {
    employee = employeeContainer.options[i];
    if (employee.selected) {
      console.log(employee);
      let recipientEID = employeeContainer.options[i].getAttribute("data-eid");
      recipientEID = parseInt(recipientEID);
      console.log(recipientEID);
      employeeArray.push(recipientEID);
    }
  }
  return employeeArray;
}

//function handleUserResponseClick() {
//    window.alert('user response initiated');
//    renderUserResponsePage();
//    showPanel('responseTab');
//}

function renderUserResponsePage(e) {
  console.log(e);
  const sID = e.getAttribute("data-sID"); 
  console.log(sID);
  GetSurvey(sID); // sends a response to the global surveyToTake variable
  sleep(5000).then(() => {
    console.log(surveyToTake);
    document.querySelector('#responseTab').innerHTML =
      `
        <div id="userSurvey" class="w3-container w3-display-middle w3-twothird" padding-top: 180px; padding-bottom: 50px;">
            <div class="w3-card-4">
            <div class="w3-container w3-teal"><h2>Survey Response</h2></div>
            <form id="my-survey-form" class="w3-container">
                <div class="w3-padding-16">
                <label class="w3-text-teal"><b>Question</b></label>
                <p id="questionText">${surveyToTake[0].questionText}</p>
                <input id="response" type="range" min="0" max="10" step="1" value="0" oninput="sliderChange(this.value)" class="w3-input w3-border w3-light-grey">
                <p>Response: <b><output id="responseOutput" class="w3-text-red">0</output></b></p>
                <!-- <input id="cq-questionText" class="w3-input w3-border w3-light-grey" type="text"> -->
                </div>
                <div class="w3-padding-16">
                <input id="createQuestionButton" type="submit" class="w3-btn w3-teal" href="#" target="_blank" style="width: 95%; margin: 5px;">
                </div>
            </form>
            </div>
        </div>
        <script>
		    function sliderChange(val) {
     		    document.getElementById('responseOutput').innerHTML = val;
		        }
	    </script>
        `
    showPanel('responseTab');

    // then render the questions
  })
    
}

function renderUserResponsePageFromURL(sID) {
  GetSurvey(sID); // sends a response to the global surveyToTake variable
  sleep(5000).then(() => {
    console.log(surveyToTake);
    document.querySelector('#responseTab').innerHTML =
      `
        <div id="userSurvey" class="w3-container w3-display-middle w3-twothird" padding-top: 180px; padding-bottom: 50px;">
            <div class="w3-card-4">
            <div class="w3-container w3-teal"><h2>Survey Response</h2></div>
            <form id="my-survey-form" class="w3-container">
                <div class="w3-padding-16">
                <label class="w3-text-teal"><b>Question</b></label>
                <p id="questionText">${surveyToTake[0].questionText}</p>
                <input id="response" type="range" min="0" max="10" step="1" value="0" oninput="sliderChange(this.value)" class="w3-input w3-border w3-light-grey">
                <p>Response: <b><output id="responseOutput" class="w3-text-red">0</output></b></p>
                <!-- <input id="cq-questionText" class="w3-input w3-border w3-light-grey" type="text"> -->
                </div>
                <div class="w3-padding-16">
                <input id="createQuestionButton" type="submit" class="w3-btn w3-teal" href="#" target="_blank" style="width: 95%; margin: 5px;">
                </div>
            </form>
            </div>
        </div>
        <script>
		    function sliderChange(val) {
     		    document.getElementById('responseOutput').innerHTML = val;
		        }
	    </script>
        `
    showPanel('responseTab');

    // then render the questions
  })

}

function handleCreateNewQuestionClick() {
    window.alert('create new question initiated');
    renderCreateNewQuestionPage();
    showPanel('createQuestionTab');
}

function renderCreateNewQuestionPage() {
    document.querySelector('#createQuestionTab').innerHTML =
        `
        <div id="createQuestionTab" class="w3-container w3-display-middle w3-twothird" padding-top: 180px; padding-bottom: 50px;">
          <div class="createQuestionForm w3-card-4">
            <div class="w3-container w3-teal"><h2>Create New Question</h2></div>
            <form id="createQuestionForm" class="w3-container">
              <div class="w3-padding-16">
                <label class="w3-text-teal"><b>Question text</b></label>
                <input id="cq-questionText" class="w3-input w3-border w3-light-grey" type="text">
              </div>
              <div class="w3-padding-16">
                <input id="createQuestionButton" type="submit" class="w3-btn w3-teal" href="#" target="_blank" style="width: 95%; margin: 5px;">
              </div>
            </form>
          </div>
        </div>
        `
}

// magic show panel function
function showPanel(panelId) {
  for (var i = 0; i < contentPanels.length; i++) {
    if (panelId == contentPanels[i]) {
      $('#' + contentPanels[i]).css('visibility', 'visible');
    } else {
      $('#' + contentPanels[i]).css('visibility', 'hidden');
    }
  }
}

function hideModal() {
  document.querySelector('#loginModal').style.display = "none";
}
 
function clearHomeTab() {
  document.querySelector('#homeTab').innerHTML = '';
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}


// SENDING AN EMAIL STUFF
var templateParams = {
  surveyURL: 'localhost:50406?12345',
};

function sendTestEmail() {
  emailjs.send('default_service', 'surveylink', templateParams)
    .then(function (response) {
      console.log('SUCCESS!', response.status, response.text);
    }, function (error) {
      console.log('FAILED...', error);
    });
}

//// ?x=Hello
//function parseURLForQueryString(variable) {
//  var query = window.location.search.substring(1);
//  console.log(query);
//  var vars = query.split('&');
//  console.log(vars);
//  for (var i = 0; i < vars.length; i++) {
//    var pair = vars[i].split('=');
//    console.log(pair);
//    if (decodeURIComponent(pair[0]) == variable) {
//      return decodeURIComponent(pair[1]);
//    }
//    else {
//      return null;
//    }
//  }
//}

//// $.urlParam('param1');
//$.urlParam = function (name) {
//  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
//  if (results == null) {
//    return null;
//  }
//  return decodeURI(results[1]) || 0;
//}

// Services
// Utilizes the LogOn C# Web Service
function LogOn(userName, password) {
  var webMethod = 'AccountServices.asmx/LogOn';
  var parameters =
    '{"userName":"' + encodeURI(userName) + '","password":"' + encodeURI(password) + '"}';

  $.ajax({
    type: 'POST',
    url: webMethod,
    data: parameters,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (msg) {
    if (msg.d.loggedIn) {
      alert("logon success");
      let searchParams = new URLSearchParams(window.location.search)
      console.log(searchParams);
      //searchParams.has('sent')
      //console.log(queryString);
      console.log(searchParams.has('sID'));
      if (searchParams.has('sID') == false) {
        userInfo = msg.d;
        console.log(userInfo); // remove for production
        clearLogOnForm();
        hideModal();
        clearHomeTab();
        renderAccountPage(userInfo);
        return true;
      } else {
        alert('this is where we show the other page');
        let searchParams = new URLSearchParams(window.location.search)
        let param = searchParams.get('sID');
        console.log(param); // we will use this to actually show the survey
        userInfo = msg.d;
        console.log(userInfo); // remove for production
        clearLogOnForm();
        hideModal();
        clearHomeTab();
        renderUserResponsePageFromURL(param);
        return true;
      }
      } else {
        //server replied false, so let the user know
        //the logon failed
      alert('logon failed');
        return false;
      }
    },
      error: function (e) {
      alert('boo...');
    }
  });
}

//logs the user off both at the client and at the server
function LogOff() {
  var webMethod = 'AccountServices.asmx/LogOff';
  $.ajax({
    type: 'POST',
    url: webMethod,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (msg) {
      if (msg.d) {
        showPanel('homeTab');
        userInfo = undefined;
      } else {
        alert('something went wrong with log off');
      }
    },
    error: function (e) {
      alert('boo...');
    }
  });
}

function GetAccounts() {
    var webMethod = 'AccountServices.asmx/GetEmployees';
    $.ajax({
        type: 'POST',
        url: webMethod,
        //data: parameters,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) {
            console.log(msg.d);
            employees = msg.d;
            return msg.d;
        },
        error: function (e) {
            alert('Error getting questing from API');
        }
    });
}

function GetSurveyQuestions() {
    var webMethod = 'AccountServices.asmx/GetAllSurveyQuestions';
    $.ajax({
      type: 'POST',
      url: webMethod,
      //data: parameters,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (msg) {
        console.log(msg.d);
        surveyQuestions = msg.d;
        console.log(surveyQuestions);
        return msg.d;
      },
      error: function (e) {
          alert('Error getting questing from API');
      }
    });
}

function GetUnrespondedSurveys(eID) {
    var webMethod = 'AccountServices.asmx/GetUnrespondedSurveys';
    var parameters = '{"eID":"' + encodeURI(eID) + '"}';

    $.ajax({
        type: 'POST',
        url: webMethod,
        data: parameters,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) {
            console.log(msg.d);
            unrespondedSurveys = msg.d;
            return msg.d;
        },
        error: function (e) {
            alert('Error getting questing from API');
        }
    });
}

function GetSurvey(sID) {
  var webMethod = 'AccountServices.asmx/GetSurvey';
  var parameters = '{"sID":"' + encodeURI(sID) + '"}';

  $.ajax({
    type: 'POST',
    url: webMethod,
    data: parameters,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (msg) {
      console.log(msg.d);
      surveyToTake = msg.d;
      return msg.d;
    },
    error: function (e) {
      alert('Error getting survey from API');
    }
  });
}
//int qID, int privacy, int asking_eID, string date
function CreateSurvey(qID, privacy, asking_eID, date) { // add recipient_eID in later
  var webMethod = 'AccountServices.asmx/CreateSurvey';
  var parameters = `{"qID": ${encodeURI(qID)}, "privacy": ${encodeURI(privacy)}, "asking_eID": ${encodeURI(asking_eID)}, "date": "${encodeURI(date)}"}` //"recipient_eID": ${encodeURI(recipient_eID)}
  console.log(parameters);
  $.ajax({
    type: 'POST',
    url: webMethod,
    data: parameters,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (msg) {
      console.log(msg.d);
      return msg.d;
    },
    error: function (e) {
      console.log(e);
      alert('Error getting survey from API');
    }
  });
}



// login form submit event listener
document.querySelector('#loginForm').addEventListener('submit', function (e) {
    handleLoginFormSubmit(e);
});
