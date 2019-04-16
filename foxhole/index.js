// Globals
let userInfo = undefined;
let surveyQuestions = undefined;
let employees = undefined;
let unrespondedSurveys = undefined;
let surveyToTake = undefined;
let surveyID = undefined;
let clickingLink = false;

// content panels used in hiding showing
const contentPanels = [
  'homeTab',
  'accountTab',
  'surveyTab',
  'manageTab',
  'responseTab',
  'createQuestionTab',
  'editAccountTab',
  'createAccountTab',
    'analyticsTab',
    'analyticsLoadingTab'
];
 
// login form submit handler
function handleLoginFormSubmit(e) {
  e.preventDefault();
  const id = document.querySelector('#userName').value;
  const pass = document.querySelector('#pswr').value;
  LogOn(id, pass);
  console.log(userInfo);
}

function clearLogOnForm() {
  document.querySelector('#userName').value = "";
  document.querySelector('#pswr').value = "";
}

function renderHomePage() {
  document.querySelector('#createAccountTab').style.height = "0px";
  document.querySelector('#editAccountTab').style.height = "0px";


  document.querySelector('#homeTab').innerHTML = 
    ` <h2 class="w3-margin w3-text-indigo">Hi there!</h2>
      <h2 class="w3-margin w3-text-indigo">Welcome to Foxhole</h2>
      <img src="https://openclipart.org/download/279046/Cute-Fox-Without-Background.svg" />
      <button class="w3-button w3-indigo w3-padding-large w3-large w3-margin-top" onclick="document.getElementById('loginModal').style.display='block'" style="width:auto;">Login</button>`;
}


function renderAccountManagementPage() {
  if (userInfo.admin == 1) {
    document.querySelector('#manageTab').innerHTML =
       `
        <div class="w3-bar w3-indigo w3-card w3-left-align w3-large">
                <a class="w3-bar-item w3-button w3-padding-large w3-hover-white" onClick="renderAccountPage(userInfo)" id="-button">
                Home
                </a>
                <a id="account-tab-link" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" onClick="handleCreateAccountClick(this)" id="manageAccount-button">
                Create Account
                </a>
        </div>
        <div class="w3-container">
          <div class="w3-section">
             <ul id="userAccountList" class="w3-ul w3-card-4 w3-white"></ul>
          </div>
        </div>
        <br>`
       GetEmployees();
       showPanel('manageTab');
  } else {
      window.alert('Not an authorized user');
  }      

}

function renderAccountPage(userInfo) {
    // show account page
    document.querySelector('#accountTab').innerHTML =
        `
      <div class="w3-display-middle-top">
	  	<div class="w3-bar w3-indigo w3-card w3-left-align w3-large">
	      <a class="w3-bar-item w3-button w3-padding-large w3-hover-white" onClick="handleLogoffClick()" id="logoff-button">
	        Logout
	      </a>
	      <a class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" onClick="renderAccountManagementPage()" id="manageAccount-button">
	        Manage Account
	      </a>
          <a class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" onClick="renderAnalyticsPage()" id="analytics-button">
	        Analytics
	      </a>
	    </div>
	   <div class="w3-container">
	       <div class="w3-center w3-padding-large" style="margin-top: 20px;">
	       		<img src="assets/images/img_avatar.png" class="w3-bar-item w3-circle w3-hide-small" style="width:120px">
	     	 	<h1 class="w3-text-teal">Hello ${userInfo.firstName}!</h1>
	       		<button class="w3-button w3-indigo w3-padding-large w3-large w3-margin-top w3-hover-white" onclick="handleCreateSurveyClick(this)" id="createSurveyButton">Create Survey</button>
	       </div> 
	   </div>
	   <div class="w3-display-container">
	       <div id="unrespSurvSection" class="w3-container" style="width: 85%; margin:auto">
              <div id="surveyContainer" class="w3-lightgrey w3-padding-large w3-large" style="margin-top: 10px;">
                  <header>Unresponded Surveys</header>
              </div>
	          <div class="">
	             <ul id="userSurveyList" class="w3-ul w3-card-4 w3-white"></ul>
	          </div>
	       </div>	
        </div>
	  </div>
      <br>
`

    // render the surveys that an employee has not yet responded to

    GetUnrespondedSurveys(userInfo.eID);

    // hides admin features from regular user
    if (userInfo.admin != 1) {
        document.getElementById('manageAccount-button').style.display = 'none';
        document.getElementById('createSurveyButton').style.display = 'none';
        document.getElementByID('analytics-button').style.display = 'none';
    }
    // show the rendered page
    showPanel('accountTab');
}

function renderUnrespondedSurveys() {
  unrespondedSurveys.map(function (survey) {
    let date = survey.date;
    var formattedDate = date.substring(0, date.length - 11);
    console.log(formattedDate);
    //let formattedDate;
    document.querySelector('#userSurveyList').innerHTML +=
      `<li class="w3-bar">
        <span data-sID=${survey.sID} onClick="renderUserResponsePage(this)" class="takeSurveyButton w3-bar-item w3-button w3-xlarge w3-right">
          <i class="fa fa-reply"></i>
          <p class="takeSurveyButton w3-small">Take Survey</p>
        </span>
   
        <div class="w3-bar-item">
          <span class="w3-large w3-text-grey"> ${survey.questionText} </span><br>
          <span class="w3-large w3-text-grey"> ${formattedDate} </span><br>
        </div>
      </li>`
    });
}  

function renderEmployeeAccounts(employees) {
    document.querySelector('#manageTab').innerHTML += `
  <div class="w3-container">
    <ul id="userAccountList" class="w3-ul w3-card-4"></ul>
  </div>
  `
    document.querySelector('#userAccountList').innerHTML = "";
    document.querySelector('#accountTab').style.height = "0px";


    employees.map(function (employee, index) {
        document.querySelector('#userAccountList').innerHTML += `
      <li class="w3-bar">
        <span data-eID=${employee.eID} onclick="handleDeleteAccountClick(this)" class="accountDeleteButton w3-bar-item w3-button w3-xlarge w3-right">
          <i data-eID=${employee.eID} onclick="handleDeleteAccountClick(this)"  class="accountDeleteButton fa fa-times" aria-hidden="true"></i>
          <p data-eID=${employee.eID} onclick="handleDeleteAccountClick(this)"  class="accountDeleteButton w3-small">delete</p>
        </span>
        <span data-eID=${employee.eID} onclick="handleEditAccountClick(this)" class="questionEditButton w3-bar-item w3-button w3-xlarge w3-right">
          <i data-eID=${employee.eID} onclick="handleEditAccountClick(this)" class="fa fa-pencil" aria-hidden="true"></i>
          <p data-eID=${employee.eID} onclick="handleEditAccountClick(this)" class="w3-small">edit</p>
        </span>
        <div class="w3-bar-item">
          <span class="w3-large w3-text-grey">Employee: ${employee.firstName}  ${employee.lastName}</span><br>
        </div>
      </li>
    `
    });
}


function handleLogoffClick() {
  LogOff();
  renderHomePage();
  showPanel('homeTab');
}

function handleCreateSurveyClick() {
  renderSurveyPage();
  showPanel('surveyTab');
}

function handleDeleteAccountClick(event) {
  const eID = event.getAttribute("data-eID");
  console.log(`employeeID is ${eID}`);
  DeleteAccount(eID);
}

function handleEditAccountClick(event) {
    const eID = event.getAttribute("data-eID");
    // first we render the form filled with that account details
    renderEditAccountForm(eID);
}

function handleCreateAccountClick(e) {
    //clear the questions list
    document.querySelector('#userAccountList').innerHTML = "";
    showPanel('createAccountTab')
}

function renderEditAccountForm(eID) {
    showPanel('editAccountTab');
    console.log(employees);
    console.log(eID);

    employees.filter(function (q) {
        console.log(q);
        return q.eID == eID;
    }).map(function (q) {
        document.querySelector('#eq-userName').value = q.userName;
        document.querySelector('#eq-password').value = q.password;
        document.querySelector('#eq-firstName').value = q.firstName;
        document.querySelector('#eq-lastName').value = q.lastName;
        document.querySelector('#eq-email').value = q.email;
        document.querySelector('#eq-position').value = q.position;
        document.querySelector('#eq-eID').value = q.eID;
        })
    };

function handleEditAccountFormSubmit(e) {
    e.preventDefault();
    const eID = document.querySelector('#eq-eID').value;
    const userName = document.querySelector('#eq-userName').value;
    const password = document.querySelector('#eq-password').value;
    const firstName = document.querySelector('#eq-firstName').value;
    const lastName = document.querySelector('#eq-lastName').value;
    const email = document.querySelector('#eq-email').value;
    const position = document.querySelector('#eq-position').value;
    EditAccount(eID, userName, password, firstName, lastName, email, position);
    document.querySelector('#editAccountTab').innerHTML = "";
}

function handleCreateAccountFormSubmit(e) {
    e.preventDefault();
    //const eID = document.querySelector('#cq-eID').value;
    const userName = document.querySelector('#cq-userName').value;
    const password = document.querySelector('#cq-password').value;
    const firstName = document.querySelector('#cq-firstName').value;
    const lastName = document.querySelector('#cq-lastName').value;
    const email = document.querySelector('#cq-email').value;
    const position = document.querySelector('#cq-position').value;
    //alert('form about to be submitted');
    // actually create the account
    console.log(userName + " " + password + " " + firstName + " " + lastName + " " + email + " " + position)
    CreateAccount(userName, password, firstName, lastName, email, position);
    //document.querySelector('createAccountTab').innerHTML = "";
}

function renderSurveyPage() {
  GetSurveyQuestions();
  document.querySelector('#accountTab').style.height = "0px";
  document.querySelector('#responseTab').style.height = "0px";
  document.querySelector('#manageTab').style.height = "0px";
}

function handleCreateSurveySubmit(e) {
  e.preventDefault;

  // qID, privacy, asking_eID, date, int[] recipient_eID
  let qID = getSelectedQuestion();
  let privacy = undefined;
  if (document.querySelector('#anonymous').checked) {
    privacy = 1;
  } else {
    privacy =0
  }
  console.log(userInfo.eID);
  let asking_eID = userInfo.eID;
  let d = new Date();
  let datestring = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

  let recipients = getSelectedEmployees();
  let recipientEmailAddresses = getSelectedEmployeesEmails();
  showPanel('accountTab');

  // cleanUp
  document.querySelector('#anonymous').checked = false;

  // It doesn't matter if this stuff is slow because it happens behind the scenes
  CreateSurvey(qID, privacy, asking_eID, datestring); // saves to global
  sleep(10000).then(() => {
    recipients.map(function (recipient) {
      //FillRecipientsTable(recipient, surveyID);
      sleep(10000).then(() => {
        // pause to allow service to execute
        // fillrecipientstable(4, 2); /// testing
        FillRecipientsTable(recipient, surveyID);

      })
    });
  });

  sleep(10000).then(() => {
    sendRecipientEmails(surveyID, recipientEmailAddresses);
  });
}

// returns the recipients as array of ints to be consumed by the CreateSurvey() service
function getSelectedQuestion() {
  let questionContainer = document.getElementById('questionContainer'), question, i;
  let selectedQuestion = undefined;

  for (i = 0; i < questionContainer.length; i++) {
    question = questionContainer.options[i];
    if (question.selected) {
      let selectedQID = questionContainer.options[i].getAttribute("data-qid");
      selectedQID = parseInt(selectedQID);
      selectedQuestion = selectedQID;
    }
  }
  return selectedQuestion;
}

function getSelectedEmployeesEmails() {
  let employeeContainer = document.getElementById('employeeContainer'), employee, i;
  let recipientEmails = [];

  for (i = 0; i < employeeContainer.length; i++) {
    employee = employeeContainer.options[i];
    if (employee.selected) {
      let recipientEmail = employeeContainer.options[i].value + "," + " ";
      recipientEmails.push(recipientEmail);
    }
  }

  let recipientEmailString = "";

  recipientEmails.map(function (email) {
      recipientEmailString += email
  })
  return recipientEmailString;
}

// returns the recipients as array of ints to be consumed by the CreateSurvey() service
function getSelectedEmployees() {
  let employeeContainer = document.getElementById('employeeContainer'), employee, i;
  let employeeArray = [];

  for (i = 0; i < employeeContainer.length; i++) {
    employee = employeeContainer.options[i];
    if (employee.selected) {
      let recipientEID = employeeContainer.options[i].getAttribute("data-eid");
      recipientEID = parseInt(recipientEID);
      employeeArray.push(recipientEID);
    }
  }
  return employeeArray;
}


function renderUserResponsePage(e) {
  const sID = e.getAttribute("data-sID"); 
  GetSurvey(sID); // sends a response to the global surveyToTake variable   
}

function renderUserResponsePageFromURL(sID) {
  GetSurvey(sID); // sends a response to the global surveyToTake variable
 
}

function sliderChange(val) {
  document.getElementById('responseOutput').innerHTML = val;
}

function handleSurveySubmit(e) {
  console.log(e);
  console.log(surveyToTake[0]);
  let eID = userInfo.eID;
  let sID = parseInt(surveyToTake[0].sID);
  let d = new Date();
  let datestring = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  let answerValue = parseInt(document.querySelector('#responseOutput').value);
  // this is where we actually anonymize the response
  if (surveyToTake[0].privacy == 1) {
    SubmitAnonSurveyResponse(eID, sID, answerValue, datestring);
  } else {
    SubmitSurveyResponse(eID, sID, answerValue, datestring);
  }
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


function sendRecipientEmails(sID, recipientEmailString) {
  // SENDING AN EMAIL STUFF
  var templateParams = {
    surveyURL: `http://localhost:50406?sID=${sID}`,
    recipients: `${recipientEmailString}`
  };

  emailjs.send('default_service', 'surveylink', templateParams)
    .then(function (response) {
      console.log('SUCCESS Sending Emails!', response.status, response.text);
    }, function (error) {
      console.log('FAILED... Sending Emails', error);
    });
}

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
      let searchParams = new URLSearchParams(window.location.search)
      if (searchParams.has('sID') == false) {
        userInfo = msg.d;
        console.log(userInfo); // remove for production
        clearLogOnForm();
        hideModal();
        clearHomeTab();
        renderAccountPage(userInfo);
        return true;
      } else {
        clickingLink = true;
        let searchParams = new URLSearchParams(window.location.search)
        let param = searchParams.get('sID');
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
          employees = msg.d;
          //const sQuestions = GetSurveyQuestions();
          console.log(surveyQuestions);
          const questionContainer = document.querySelector('#questionContainer');

          surveyQuestions.map(function (question) {
            questionContainer.innerHTML += `<option data-qID=${question.qID} value="example1">${question.text}</option>`;
          });

          const employeeContainer = document.querySelector('#employeeContainer');
          employees.map(function (employee) {
            employeeContainer.innerHTML += `<option data-eID=${employee.eID}">${employee.email}</option>`;
          });
            renderEmployeeAccounts(msg.d)
        },
        error: function (e) {
            alert('Error getting questing from API');
        }
    });
}

function GetEmployees() {
    var webMethod = 'AccountServices.asmx/GetEmployees';
    $.ajax({
        type: 'POST',
        url: webMethod,
        //data: parameters,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) {
            employees = msg.d;
            //const sQuestions = GetSurveyQuestions();
            renderEmployeeAccounts(msg.d)
        },
        error: function (e) {
            alert('Error getting questing from API');
        }
    });
}

function GetBarDatas() {
    var webMethod = 'AccountServices.asmx/GetBarData';
    $.ajax({
        type: 'POST',
        url: webMethod,
        //data: parameters,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) {
            barData = msg.d;
            document.getElementById('analyticsLoadingBar').value += 0.4;
            console.log("BAR DATA");
            console.log(msg.d);
            return msg.d;
        },
        error: function (e) {
            alert('Error getting questing from API');
        }
    });
}
function GetPieDatas() {
    var webMethod = 'AccountServices.asmx/GetPieData';
    $.ajax({
        type: 'POST',
        url: webMethod,
        //data: parameters,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) {
            pieData = msg.d;
            console.log("PIE DATA");
            document.getElementById('analyticsLoadingBar').value += 0.3;
            console.log(msg.d);
            return msg.d;
        },
        error: function (e) {
            alert('Error getting questing from API');
        }
    });
}
function GetLineDatas() {
    var webMethod = 'AccountServices.asmx/GetLineData';
    $.ajax({
        type: 'POST',
        url: webMethod,
        //data: parameters,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) {
            lineData = msg.d;
            console.log("LINE DATA");
            document.getElementById('analyticsLoadingBar').value += 0.3;
            console.log(msg.d);
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
        surveyQuestions = msg.d;
        GetAccounts();
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
            renderUnrespondedSurveys();
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
      document.querySelector('#responseTab').innerHTML =
        `
        <div id="userSurvey" class="w3-container w3-display-middle w3-twothird" padding-top: 180px; padding-bottom: 50px;">
            <div class="w3-card-4">
            <div class="w3-container w3-indigo">
                <span onclick="renderAccountPage(userInfo)" class="close-survey" style="color: white; font-size: 35px; font-weight: bold; float: right;" title="Close Modal">&times;</span>
                <h2>Survey Response</h2>
            </div>
            <form id="my-survey-form" class="w3-container w3-white">
                <div class="w3-padding-16">
                <label class="w3-text-indigo"><b>Question</b></label>
                <p id="questionText">${surveyToTake[0].questionText}</p>
                <input id="response" type="range" min="0" max="10" step="1" value="0" oninput="sliderChange(this.value)" class="w3-input w3-border w3-light-grey">
                <p>Response: <b><output id="responseOutput" class="w3-text-red">0</output></b></p>
                <!-- <input id="cq-questionText" class="w3-input w3-border w3-light-grey" type="text"> -->
                </div>
                <div class="w3-padding-16" style="text-align: center;">
                <input id="createQuestionButton" data-sid=${sID} onclick="handleSurveySubmit(this)" type="button" value="Submit" class="w3-btn w3-indigo w3-large" href="#" target="_blank" style="width: 40%; margin: 5px;">
                </div> 
            </form>
            </div>
        </div>
        `
      showPanel('responseTab');
      return msg.d;
    },
    error: function (e) {
      alert('Error getting survey from API');
    }
  });
}
//int qID, int privacy, int asking_eID, string date
function CreateSurvey(qID, privacy, asking_eID, date, recipients) { // add recipient_eID in later
  var webMethod = 'AccountServices.asmx/CreateSurvey';
  var parameters = `{"qID": ${encodeURI(qID)}, "privacy": ${encodeURI(privacy)}, "asking_eID": ${encodeURI(asking_eID)}, "date": "${encodeURI(date)}"}`
  $.ajax({
    type: 'POST',
    url: webMethod,
    data: parameters,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (msg) {
      console.log(msg.d);
      surveyID = msg.d;
      return msg.d;
    },
    error: function (e) {
      console.log(e);
      alert('Error creating Survey');
    }
  });
}

function FillRecipientsTable(recipient_eID, surveyID) {
  var webMethod = 'AccountServices.asmx/FillRecipientsTable';
  var parameters = `{"recipient_eID": ${encodeURI(recipient_eID)}, "surveyID": ${encodeURI(surveyID)}}`;
  $.ajax({
    type: 'POST',
    url: webMethod,
    data: parameters,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (msg) {
      console.log(msg.d);
      renderAccountPage(userInfo);
      return msg.d;
    },
    error: function (e) {
      console.log(e);
      alert('Error getting survey from API');
    }
  });
}

function DeleteAccount(eID) {
    var webMethod = 'AccountServices.asmx/DeleteAccount';
    var parameters = `{ "eID" : ${encodeURI(eID)}}`;
    $.ajax({
        type: 'POST',
        url: webMethod,
        data: parameters,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) {
            console.log(msg.d);
            GetEmployees();
            renderAccountManagementPage();
            //renderEmployeeAccounts(msg.d);
            return msg.d;
            showPanel('manageTab');
        },
        error: function (e) {
            alert('Error deleting account');
        }
    });
}

function EditAccount(eID, userName, password, firstName, lastName, email, position) {
    var webMethod = 'AccountServices.asmx/UpdateAccount';
    var parameters = `{
    "eID": ${eID},
    "userName": "${encodeURI(userName)}",
    "password" : "${encodeURI(password)}",
    "firstName" : "${encodeURI(firstName)}",
    "lastName" : "${encodeURI(lastName)}",
    "email" : "${encodeURI(email)}",
    "position" : "${encodeURI(position)}"
  }`;
    $.ajax({
        type: 'POST',
        url: webMethod,
        data: parameters,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) {
            // clear some old stuff out to make room...
            //document.querySelector('#accountSettingsTab').innerHTML = "";
            document.querySelector('#userAccountList').innerHTML = "";
            // render the new page with the edited account
            GetEmployees();
            renderAccountManagementPage();
            //renderEmployeeAccounts(msg.d);
            showPanel('manageTab');
        },
        error: function (e) {
            alert('boo...');
        }
    });
}

function CreateAccount(userName, password, firstName, lastName, email, position) {
    var webMethod = 'AccountServices.asmx/CreateAccount';
    var parameters = `{
    "userName": "${encodeURI(userName)}",
    "password" : "${encodeURI(password)}",
    "firstName" : "${encodeURI(firstName)}",
    "lastName" : "${encodeURI(lastName)}",
    "email" : "${encodeURI(email)}",
    "position" : "${encodeURI(position)}"
  }`;
    $.ajax({
        type: 'POST',
        url: webMethod,
        data: parameters,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) {
            alert('Congrats your account was approved...');
            //document.querySelector('#accountSettingsTab').innerHTML = "";
            showPanel('manageTab');
            GetEmployees();
            renderAccountManagementPage();
            //renderEmployeeAccounts(msg.d);
        },
        error: function (e) {
            alert('boo...');
        }
    });
}

function SubmitSurveyResponse(eID, sID, answer, date) {
  var webMethod = 'AccountServices.asmx/SubmitSurveyResponse';
  var parameters = `{
    "eID": ${eID},
    "sID" : ${sID},
    "answer" : ${answer},
    "date" : "${encodeURI(date)}"
  }`;
  $.ajax({
    type: 'POST',
    url: webMethod,
    data: parameters,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (msg) {
      console.log(msg);
      document.querySelector('#userSurvey').innerHTML = "";
      renderAccountPage(userInfo);
    },
    error: function (e) {
      alert('Error submitting survey response');
      console.log(e);
    }
  });
}

function SubmitAnonSurveyResponse(eID, sID, answer, date) {
  var webMethod = 'AccountServices.asmx/SubmitAnonSurveyResponse';
  var parameters = `{
    "eID": ${eID},
    "sID" : ${sID},
    "answer" : ${answer},
    "date" : "${encodeURI(date)}"
  }`;
  $.ajax({
    type: 'POST',
    url: webMethod,
    data: parameters,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (msg) {
      console.log(msg);
      document.querySelector('#userSurvey').innerHTML = "";
      renderAccountPage(userInfo);
    },
    error: function (e) {
      alert('Error submitting survey response');
      console.log(e);
    }
  });
}

// login form submit event listener
document.querySelector('#loginForm').addEventListener('submit', function (e) {
    handleLoginFormSubmit(e);
});

document.querySelector('#editAccountForm').addEventListener('submit', function (e) {
    handleEditAccountFormSubmit(e);
});

document.querySelector('#create-account-form').addEventListener('submit', function (e) {
    console.log(e);
    handleCreateAccountFormSubmit(e);
});


var barData;
var pieData;
var lineData;


async function renderAnalyticsPage() {
    showPanel('analyticsLoadingTab');

    setAnalyticsData();
    setTimeout(function afterThreeSecond() {
        if (userInfo.admin == 1) {
            //document.querySelector('#analyticsTab').innerHTML = ''
            showPanel('analyticsTab');

            document.getElementById('analyticsLoadingBar').value = 0;
            // show the rendered page
            //setTimeout(function afterThreeSecond() {



            //document.querySelector('#analyticsTab').innerHTML =
            //    `
            //<div id="analyticsPage" >

            //        <div style="text-align: center;">
            //            <input id="analyticsBackButton" value="Back to Surveys" onclick="showPanel('accountTab');" type="button" class="w3-btn w3-indigo w3-large w3-display-topright" href="#" target="_blank" style="width: auto; margin: 5px;">
            //        </div>

            //        <div class="first2Container">
            //            <!-- Bar Graph HTML -->
            //            <div class="halfGraphDiv">
            //                <h2>
            //                    Chart 1 (Chart.js)
            //                </h2>
            //                <canvas id="chartjs-2" class="chartjs" width="745" height="372" style="display: block; height: 298px; width: 596px;"></canvas>

            //                <!-- Pie Graph HTML -->
            //                <h2>Chart 2 (Pie Chart)</h2>
            //                <div id="canvas-holder" style="width:100%">
            //                    <div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div>
            //                    <canvas id="chart-area" style="display: block; height: 304px; width: 608px;" width="760" height="380" class="chartjs-render-monitor"></canvas>
            //                </div>
            //            </div>

            //        </div>

            //        <!-- Line Chart HTML -->
            //        <div class='fullGraphDiv'>
            //            <h2>Chart 3 (Line Chart)</h2>
            //            <canvas id="line-chart" width="800" height="450"></canvas>
            //        </div>
            //    </div>
            //</div>
            //`
            //}, 1000)
        }
        else {
            window.alert('Not an authorized user');
        }
    }, 7000)

}

async function setAnalyticsData() {
    barData = GetBarDatas();
    pieData = GetPieDatas();
    lineData = GetLineDatas();
    UpdateBarData();
    return;
}

// Start of Analytics Page JS
function dateToMonth(datestring) {

    var monthArray = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];


    var tempDate = new Date(datestring);
    var tempMonthNum = tempDate.getMonth();

    var tempMonthName = monthArray[tempMonthNum - 1];

    return tempMonthName;
}


// Take an array of values, and return an ordered array filled with name value pairs in an ordered sequence of months, with their average scores

// This is a sample just to display some months, the data would be a consolidated for for each of the months

var objArray = [{ response: 1, date: '2013-8' },
{ response: 4, date: '2013-8' },
{ response: 7, date: '2013-9' },
{ response: 2, date: '2013-10' },
{ response: 3.5, date: '2013-11' },
{ response: 9, date: '2013-12' },
{ response: 4, date: '2014-1' },
{ response: 7, date: '2014-2' },
{ response: 3, date: '2014-3' },
{ response: 3, date: '2014-4' },
{ response: 5, date: '2014-5' },
{ response: 10, date: '2014-6' }];

var pieNonCompletedTotal = 25;

function UpdateBarData() {
    
    setTimeout(function afterThreeSecond() {
        barDateArray = [];
    barResponseArray = [];
        barResponseArray = barData.map(function (item) { return item.averageAnswer });

        pieAnswerArray = pieData.map(function (item) { return item.answer });
        // Bar Data
        for (var i = 0; i < barData.length; i++) {
            var temptext = barDateConversion(barData[i].surveyMonth) + " " + barData[i].surveyYear;
            barDateArray.push(temptext);
        }
        for (var i = 0; i < objArray.length; i++) {
            removeData(myBarChart);
        }
        for (var i = 0; i < barResponseArray.length; i++) {
            addData(myBarChart, barDateArray[i], barResponseArray[i]);
        }
        // Pie Data
        splitData(pieAnswerArray);
        for (var i = 0; i < pieChartBuckets.length; i++) {
            removeData(myPie);
        }
        for (var i = 0; i < pieChartBuckets.length; i++) {
            addData(myPie, pieLabels[i], pieChartBuckets[i]);
        }
        

        // Line Data
        for (var i = 0; i < objArray2.length; i++) {
            removeData(myLineChart);
        }

        var lineDateArray = [];
        var tempDate;
        for (var i = 0; i < lineData.length; i++) {
            tempDate = new Date(parseInt(lineData[i].date.substring(6)))
            tempDate = tempDate.toDateString();
            lineDateArray.push(tempDate);
        }
        for (var i = 0; i < lineData.length; i++) {
            addData(myLineChart, lineDateArray[i], lineData[i].ResponseRate * 100);
        }
        pieNonCompletedTotal = 0;
        for (var i = 0; i < lineData.length; i++) {
            pieNonCompletedTotal += lineData[i].numNotCompleted;
        }

        alert("Data Finished Loading");
    }, 7000)
}

function barDateConversion(monthNum) {
    var monthArray = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    var tempMonthName = monthArray[monthNum - 1];

    return tempMonthName;

    //var barDateArray = [];
    //var temptext;
    //for (var i = 0; i < barData.length; i++)
    //{ 
    //    temptext = barData[i].surveyMonth + "-" + barData[i].surveyYear;
    //    barDateArray.push(temptext)
    //}
    //return barDateArray;
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

var barResponseArray = objArray.map(function (item) { return item.response });
var barDateArray = objArray.map(function (item) { return item.date });

var monthArray = [];
for (var i = 0; i < barDateArray.length; i++) {
    var temp = dateToMonth(barDateArray[i]);
    monthArray.push(temp);
}


var myBarChart = new Chart(document.getElementById("chartjs-2"),
    {
        "type": "bar",
        "data": {
            "labels": monthArray,
            "datasets": [{
                "label": "Average Question Response",
                // The values displayed on the graph
                "data": barResponseArray,
                // Transparent background for the bars instead of filled
                "fill": false,
                // Adds each individual background color for the bars
                "backgroundColor": ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(201, 203, 207, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(201, 203, 207, 0.2)"], "borderColor": ["rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)"],
                "borderWidth": 1
            }]
        },
        "options": {
            "scales":
                { "yAxes": [{ "ticks": { "beginAtZero": true } }] }
        }
    });




// Pie Chart JS

// Separates the data into buckets based on value
var pieLabels = [
    'Very Low: (1-2)',
    'Low: (3-4)',
    'Medium: (5-6)',
    'High: (7-8)',
    'Very High: (9-10)',
    'Did not answer'
]

var pieChartBuckets = [0, 0, 0, 0, 0, 0];
var totalPie = 0;
function splitData(array) {
    totalPie = 0;
    pieChartBuckets = [0, 0, 0, 0, 0, 0];
    for (var i = 0; i < array.length; i++) {
        switch (array[i]) {
            case 1:
            case 2:
                pieChartBuckets[0] += array[i];
                break;
            case 3:
            case 4:
                pieChartBuckets[1] += array[i];
                break;
            case 5:
            case 6:
                pieChartBuckets[2] += array[i];
                break;
            case 7:
            case 8:
                pieChartBuckets[3] += array[i];
                break;
            case 9:
            case 10:
                pieChartBuckets[4] += array[i];
                break;
            case 0:
            default:
                pieChartBuckets[5] = pieNonCompletedTotal;
        }
    }

    // After the loop, sum the values (This is more computationally efficient, summing 5 values rather than adding potentially several thousand above)

    for (var i = 0; i < pieChartBuckets.length; i++) {// Gets a total of the buckets' values
        totalPie += pieChartBuckets[i];
    }
    for (var i = 0; i < pieChartBuckets.length; i++) {
        

        pieChartBuckets[i] = (pieChartBuckets[i] * 100 / totalPie).toFixed(0);
    }

}

// function calculatePercentage(bucketArray){
// 	for (var i = 0; i < array.length; i++)
// 	{
// 	}
splitData(barResponseArray);

console.log(barResponseArray);


var randomScalingFactor = function () {
    // This function returns a random value for every data point in the pie chart
    return Math.round(Math.random() * 100);
};

console.log("pietotal: " + pieNonCompletedTotal);

var config = {
    type: 'pie',
    data: {
        datasets: [{
            data: [
                pieChartBuckets[0],
                pieChartBuckets[1],
                pieChartBuckets[2],
                pieChartBuckets[3],
                pieChartBuckets[4],
                pieChartBuckets[5],
            ],
            backgroundColor: [
                window.chartColors.red,
                window.chartColors.orange,
                window.chartColors.yellow,
                window.chartColors.blue,
                window.chartColors.green,
                window.chartColors.purple,
            ],
            label: 'Dataset 1'
        }],
        labels: [
            'Very Low: (1-2)',
            'Low: (3-4)',
            'Medium: (5-6)',
            'High: (7-8)',
            'Very High: (9-10)',
            'Did not answer',
        ]
    },
    options: {
        responsive: true
    }

};

window.onload = function () {
    var ctx = document.getElementById('chart-area').getContext('2d');
    window.myPie = new Chart(ctx, config);
};

var colorNames = Object.keys(window.chartColors);




// Line Chart JS 

var objArray2 = [{ ResponseRate: 26, date: '2013-8-17' },
{ ResponseRate: 35, date: '2013-8-17' },
{ ResponseRate: 53, date: '2013-9-17' },
{ ResponseRate: 65, date: '2013-10-17' },
{ ResponseRate: 61, date: '2013-11-17' },
{ ResponseRate: 69, date: '2013-12-17' },
{ ResponseRate: 52, date: '2014-1-17' },
{ ResponseRate: 57, date: '2014-2-17' },
{ ResponseRate: 80, date: '2014-3-17' },
{ ResponseRate: 72, date: '2014-4-17' }];

var result = objArray2.map(objArray2 => objArray2.ResponseRate);
var dateResult = objArray2.map(objArray2 => objArray2.date);
console.log(result)
var myLineChart = new Chart(document.getElementById("line-chart"), {
    type: 'line',
    data: {
        labels: dateResult,
        datasets: [{
            data: result,
            label: "Percent of Survey Responses",
            borderColor: "#ea2d59",
            fill: false
        }

        ]
    },
    options: {
        title: {
            display: true,
            text: 'Average Response Rate'
        }
    }
});