// Globals
let userInfo = undefined;
let surveyQuestions = undefined;
let employees = undefined;
let unresponded = undefined;

// content panels used in hiding showing
const contentPanels = [
  'homeTab',
  'accountTab',
  'surveyTab',
  'manageTab'
];

// login form submit handler
function handleLoginFormSubmit(e) {
  e.preventDefault();
  const id = document.querySelector('#userName').value;
  const pass = document.querySelector('#pswr').value;
  LogOn(id, pass);
  console.log(userInfo);
  //sendTestEmail();
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
      <div class="w3-container">
        <div class="w3-section">
          <ul id="userSurveyList" class="w3-ul w3-card-4 w3-white"></ul>
        </div>
      </div>
      </br>`
    // render the surveys that an employee has not yet responded to
    GetUnrespondedSurveys(userInfo.eID);

    // render the questions that the user created
    //GetUserSurveys(userInfo.id);
  } else {
    // show pleb account

  }

  // show the rendered page
  showPanel('accountTab');
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
            unresponded = msg.d;
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
      //survey = msg.d;
      return msg.d;
    },
    error: function (e) {
      alert('Error getting survey from API');
    }
  });
}



// login form submit event listener
document.querySelector('#loginForm').addEventListener('submit', function (e) {
    handleLoginFormSubmit(e);
});
