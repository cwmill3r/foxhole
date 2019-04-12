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
  'analyticsTab'
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
  document.querySelector('#createAccountTab').style.height = "0px";
  document.querySelector('#editAccountTab').style.height = "0px";


  document.querySelector('#homeTab').innerHTML = 
    ` <h2 class="w3-margin w3-text-indigo">Hi there!</h2>
      <h2 class="w3-margin w3-text-indigo">Welcome to Foxhole</h2>
      <img src="https://openclipart.org/download/279046/Cute-Fox-Without-Background.svg" />
      <button class="w3-button w3-indigo w3-padding-large w3-large w3-margin-top" onclick="document.getElementById('loginModal').style.display='block'" style="width:auto;">Login</button>`;
}

function renderAnalyticsPage() {
    if (userInfo.admin == 1) {
        document.querySelector('#analyticsTab').innerHTML =
        `
         
        `
    }
    else {
        window.alert('Not an authorized user');
    }
}



function renderAccountManagementPage() {
  if (userInfo.admin == 1) {
    document.querySelector('#manageTab').innerHTML =
      
       // <div class="w3-container  w3-display-middle-top">
       // <h3 class="w3-text-teal">Accounts currently registered with Foxhole</h3>
       // <div class="w3-right">
       //   <button onclick="renderAccountPage(userInfo)" id="returnButton">Return to your Account</button>
       // </div>
       // <div class="w3-left">
       //     <button onclick="handleCreateAccountClick(this)" id="createAccountButton">Create new Account</button>
       // </div>
       //</div>

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

        //  `
 
    //<div class="w3-top w3-bar w3-indigo w3-card w3-left-align w3-large">
    //    <a id="home-tab-link" class="w3-bar-item w3-button w3-padding-large w3-hover-white" onClick="handleLogoffClick()" id="logoff-button">
    //    Home
    //    </a>
    //    <a id="account-tab-link" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" onClick="renderAccountManagementPage()" id="manageAccount-button">
    //    Manage Account
    //    </a>
    //</div>
    //  <div class="w3-container">
	   //    <div class="w3-center">
	   //    		<img src="http://i.pravatar.cc/300" class="w3-bar-item w3-circle w3-hide-small" style="width:120px">
	   //  	 	<h1 class="w3-text-teal">hello ${userInfo.userName}</h1>
	   //    		<button class="w3-button w3-indigo w3-padding-large w3-large w3-margin-top w3-hover-white" onclick="handleCreateSurveyClick(this)" id="createSurveyButton">Create Survey</button>
	   //    </div> 
	   //</div>
	   //<div id="surveyContainer"></div>
	   //<div class="w3-container">
	   //   <div class="w3-section">
	   //      <ul id="userSurveyList" class="w3-ul w3-card-4 w3-white"></ul>
	   //   </div>
	   //</div>
    //  </br>`

        //`<div class="w3-top w3-bar w3-indigo w3-card w3-left-align w3-large">
        //   <a id="home-tab-link" class="w3-bar-item w3-button w3-padding-large w3-hover-white" onClick="handleLogoffClick()" id="logoff-button">
        //   Home
        //   </a>
        //   <a id="account-tab-link" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" onClick="renderAccountManagementPage()" id="manageAccount-button">
        //   Manage Account
        //   </a>
        //</div>
        //<div class="w3-container">
        //   <div class="w3-center">
        //      <img src="http://i.pravatar.cc/300" class="w3-bar-item w3-circle w3-hide-small" style="width:120px">
        //      <h1 class="w3-text-teal">hello ${userInfo.userName}</h1>
        //      <button class="w3-button w3-indigo w3-padding-large w3-large w3-margin-top w3-hover-white" onclick="handleCreateSurveyClick(this)" id="createSurveyButton">Create Survey</button>
        //   </div>
        //</div>
        //<div id="surveyContainer"></div>
        //<div class="w3-container">
        //   <div class="w3-section">
        //      <ul id="userSurveyList" class="w3-ul w3-card-4 w3-white"></ul>
        //   </div>
        //</div>
        //</br>`


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
  let asking_eID = employees[0].eID;
  let d = new Date();
  let datestring = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

  let recipients = getSelectedEmployees();
  let recipientEmailAddresses = getSelectedEmployeesEmails();
  showPanel('accountTab');

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

//function handleUserResponseClick() {
//    window.alert('user response initiated');
//    renderUserResponsePage();
//    showPanel('responseTab');
//}

function renderUserResponsePage(e) {
  const sID = e.getAttribute("data-sID"); 
  GetSurvey(sID); // sends a response to the global surveyToTake variable
  //sleep(5000).then(() => {
  //  document.querySelector('#responseTab').innerHTML =
  //    `
  //      <div id="userSurvey" class="w3-container w3-display-middle w3-twothird" padding-top: 180px; padding-bottom: 50px;">
  //          <div class="w3-card-4">
  //          <div class="w3-container w3-teal"><h2>Survey Response</h2></div>
  //          <form id="my-survey-form" class="w3-container">
  //              <div class="w3-padding-16">
  //              <label class="w3-text-teal"><b>Question</b></label>
  //              <p id="questionText">${surveyToTake[0].questionText}</p>
  //              <input id="response" type="range" min="0" max="10" step="1" value="0" oninput="sliderChange(this.value)" class="w3-input w3-border w3-light-grey">
  //              <p>Response: <b><output id="responseOutput" class="w3-text-red">0</output></b></p>
  //              <!-- <input id="cq-questionText" class="w3-input w3-border w3-light-grey" type="text"> -->
  //              </div>
  //              <div class="w3-padding-16">
  //              <input id="createQuestionButton" data-sid=${sID} onclick="handleSurveySubmit(this)" type="button" value="submit" class="w3-btn w3-teal" href="#" target="_blank" style="width: 95%; margin: 5px;">
  //              </div> 
  //          </form>
  //          </div>
  //      </div>
  //      `
  //  showPanel('responseTab');

    // then render the questions
  //})
    
}

function renderUserResponsePageFromURL(sID) {

  GetSurvey(sID); // sends a response to the global surveyToTake variable
  //sleep(5000).then(() => {
  //  document.querySelector('#responseTab').innerHTML =
  //    `
  //      <div id="userSurvey" class="w3-container w3-display-middle w3-twothird" padding-top: 180px; padding-bottom: 50px;">
  //          <div class="w3-card-4">
  //          <div class="w3-container w3-teal"><h2>Survey Response</h2></div>
  //          <form id="my-survey-form" class="w3-container">
  //              <div class="w3-padding-16">
  //              <label class="w3-text-teal"><b>Question</b></label>
  //              <p id="questionText">${surveyToTake[0].questionText}</p>
  //              <input id="response" type="range" min="0" max="10" step="1" value="0" oninput="sliderChange(this.value)" class="w3-input w3-border w3-light-grey">
  //              <p>Response: <b><output id="responseOutput" class="w3-text-red">0</output></b></p>
  //              <!-- <input id="cq-questionText" class="w3-input w3-border w3-light-grey" type="text"> -->
  //              </div>
  //              <div class="w3-padding-16">
  //              <input id="createQuestionButton" data-sid=${sID} onclick="handleSurveySubmit(this)" type="button" value="submit" class="w3-btn w3-teal" href="#" target="_blank" style="width: 95%; margin: 5px;">
  //              </div> 
  //          </form>
  //          </div>
  //      </div>
  //      `
  //  showPanel('responseTab');

  //  // then render the questions
  //})

}

function sliderChange(val) {
  document.getElementById('responseOutput').innerHTML = val;
}

function handleSurveySubmit(e) {
  let eID = userInfo.eID;
  let sID = parseInt(surveyToTake[0].sID);
  let d = new Date();
  let datestring = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  let answerValue = parseInt(document.querySelector('#responseOutput').value);
  let success = SubmitSurveyResponse(eID, sID, answerValue, datestring);
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
