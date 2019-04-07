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
  'createQuestionTab',
  'editAccountTab',
  'createAccountTab'
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
        <h3 class="w3-text-teal">Accounts currently registered with Foxhole</h3>
        <div class="w3-right">
          <button onclick="renderAccountPage(userInfo)" id="returnButton">Return to your Account</button>
        </div>
        <div class="w3-left">
            <button onclick="handleCreateAccountClick(this)" id="createAccountButton">Create new Account</button>
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

function renderEmployeeAccounts(employees) {
    document.querySelector('#manageTab').innerHTML += `
  <div class="w3-container">
    <ul id="userAccountList" class="w3-ul w3-card-4"></ul>
  </div>
  `
    document.querySelector('#userAccountList').innerHTML = "";
   
    employees.map(function (employee, index) {
        console.log(employee);
        document.querySelector('#userAccountList').innerHTML += `
      <li class="w3-bar">
        <span data-eID=${employee.eID} onclick="handleDeleteAccountClick(this)" class="accountDeleteButton w3-bar-item w3-button w3-xlarge w3-right">
          <i data-eID=${employee.eID} class="accountDeleteButton fa fa-times" aria-hidden="true"></i>
          <p data-eID=${employee.eID} class="accountDeleteButton w3-small">delete</p>
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
    window.alert('create survey clicked');
    renderSurveyPage();
  showPanel('surveyTab');
  GetSurvey(3);
  console.log(unrespondedSurveys);
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
    document.querySelector('#surveyTab').innerHTML =
        `<style>
        body {
	          font-family: Arial;
	        }

	        #question, #recipient {
	          width: 100%; 
	          padding: 12px 20px;
	          margin: 8px 0;
	          display: block;
	          border: 1px solid #ccc;
	          border-radius: 4px;
	          box-sizing: border-box;
	        }

	        #anonymous {
	          padding: 12px 20px;
	          margin: 8px 0;
	          display: block;
	          border: 1px solid #ccc;
	          border-radius: 4px;
	          box-sizing: border-box;
	        }

	        input[type=submit] {
	          width: 100%;
	          background-color: #4CAF50;
	          color: white;
	          padding: 14px 20px;
	          margin: 8px 0;
	          border: none;
	          border-radius: 4px;
	          cursor: pointer;
	        }

	        input[type=submit]:hover {
	          background-color: #45a049;
	        }

	        div.container {
	          border-radius: 5px;
	          background-color: #f2f2f2;
	          padding: 20px;
	        }
        </style>

        <div class="w3-container">
	        <form id="surveyForm">
                <div class="container">

      	            <h3 style="text-align: center;">Create A New Survey</h3>

                    <label for="ques"><b>Question</b></label>
                    <select name="ques" id="question">
        	            <option value="example1">Example 1</option>
        	            <option value="example2">Example 2</option>
        	            <option value="example3">Example 3</option>
                    </select>

                    <label for="anon"><b>Anonymous? (Check If Yes)</b></label>
                    <input type="checkbox" name="anon" id="anonymous">

		            <label for="recipient"><b>Survey Recipient (Email)</b></label>
		            <input type="text" name="recipient" id="recipient">


                    <input type="submit" value="Create Survey">
                 </div>
            </form>
        </div>`
}

function handleUserResponseClick() {
    window.alert('user response initiated');
    renderUserResponsePage();
    showPanel('responseTab');
}

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
        userInfo = msg.d;
        console.log(userInfo); // remove for production
        clearLogOnForm();
        hideModal();
        clearHomeTab();
        renderAccountPage(userInfo);
        return true;
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
            console.log(msg.d);
            surveyQuestions = msg.d;
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

function DeleteAccount(eID) {
    var webMethod = 'AccountServices.asmx/DeleteAccount';
    var parameters = `{ "eID" : ${encodeURI(eID)}}`;
    console.log(parameters);
    $.ajax({
        type: 'POST',
        url: webMethod,
        data: parameters,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) {
            console.log(msg.d);
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
    console.log(parameters);
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
            renderAccountManagementPage();
            renderEmployeeAccounts(msg.d);
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
    console.log(parameters);
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
            renderAccountManagementPage();
            renderEmployeeAccounts(msg.d);
        },
        error: function (e) {
            alert('boo...');
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
