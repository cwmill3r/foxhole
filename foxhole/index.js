// Globals
let userInfo = undefined;

// content panels used in hiding showing
const contentPanels = [
  'homeTab',
  'accountTab'
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
      <button class="w3-button w3-indigo w3-padding-large w3-large w3-margin-top" onclick="document.getElementById('loginModal').style.display='block'" style="width:auto;">Login</button>`;
}

function renderAccountPage(userInfo) {
  if (userInfo.admin == 1) {
    // show admin account page
    document.querySelector('#accountTab').innerHTML =
      `<div class="w3-container">
        <img src="http://i.pravatar.cc/300" class="w3-bar-item w3-circle w3-hide-small" style="width:85px">
        <h3 class="w3-text-teal">hello ${userInfo.userName}</h3>
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

// login form submit event listener
document.querySelector('#loginForm').addEventListener('submit', function (e) {
    handleLoginFormSubmit(e);
});