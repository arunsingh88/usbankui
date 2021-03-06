const accessToken = "2d1ddeaadc20462dba88c9beebbe0a21";
const baseUrl = "https://chatbot-py.azurewebsites.net/chatbot";
//const baseUrl = "http://127.0.0.1:5000/chatbot"
const qnaUrl = "https://vcsm-qna-stg-cqa.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=ACP-QNA&api-version=2021-10-01&deploymentName=production";
const sessionId = "1";
//const loader = `<span class='loader'><span class='loader__dot'></span><span class='loader__dot'></span><span class='loader__dot'></span></span>`;
const errorMessage = "My apologies, I'm not available at the moment. =^.^=";
const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
const loadingDelay = 700;
const aiReplyDelay = 1800;
const $document = document;
const $chatbot = $document.querySelector(".chatbot");
const $chatbotMessageWindow = $document.querySelector(
  ".chatbot__message-window");

const $chatbotHeader = $document.querySelector(".close_btn");
const $chatbotLoginIndicator = $document.querySelector(".chatbot__header");
const $chatbotLoginIndicator1 = $document.querySelector(".chatbot__message-window");
const $chatbotLoginIndicator2 = $document.querySelector(".chatbot__entry");
const $chatbotMessages = $document.querySelector(".chatbot__messages");
const $chatbotInput = $document.querySelector(".chatbot__input");
const $chatbotInputBox = $document.querySelector(".chatbot__entry");
const $chatbotSubmit = $document.querySelector(".chatbot__submit");
const userprofile = {
  Mike: { industry: "Healthcare", revenue: "$520,000", checks: 45, amount: 28000, formatamount: "28,000" },
  Anne: { industry: "Healthcare", revenue: "$440,000", checks: 120, amount: 32000, formatamount: "32,000" },
  Robin: { industry: "Manufacturing", revenue: "$150,000", checks: 350, amount: 50000, formatamount: "50,000" },

}
sessionStorage.username = 'Mike'
// $chatbotInputBox.style.display = "none"
console.log($chatbotInputBox)
document.addEventListener(
  "keypress",
  event => {
    if (event.which == 13) {
      console.log("1");
      console.log("Key press event triggered");
      validateMessage();
    }
  },
  false);

const refresh = () => {
  $chatbotMessages.innerHTML = '';
  $chatbotLoginIndicator.style.background = "#fff";
  $chatbotLoginIndicator1.style.borderStyle = "none";
  $chatbotLoginIndicator2.style.borderStyle = "none";
  sessionStorage.login = false
  setupChatbot()
}
const loader = () => {
  $chatbotMessages.innerHTML += `<li
  class='is-ai animation'
  id='loader-animation'>
<div class = "message_container">
<div class = "assigning_margin">
    <div class="is-ai__profile-picture circle">
    </div>
    <div class ="message_content">
    <div>
    <div class='chatbot__message1'>
    <span class='loader'><span class='loader__dot'></span><span class='loader__dot'></span><span class='loader__dot'></span></span>
      </div>
      </div>
      </div>
      </div>
      <!--Button body--!>
  </div>
  </li>`
}

$chatbotHeader.addEventListener(
  "click",
  () => {
    // toggle($chatbot, "chatbot--closed");
    // $chatbotInput.focus();
    var element = document.getElementsByClassName("chatbot");
    element[0].style.display = "none";
    document.getElementById("chat-circle").style.display = "block";
  },
  false);


$chatbotSubmit.addEventListener(
  "click",
  () => {
    console.log("7");
    validateMessage();
  },
  false);

document.getElementById("chat-circle").addEventListener(
  "click",
  () => {
    var element = document.getElementsByClassName("chatbot");
    element[0].classList.remove("chatbot--closed");
    element[0].style.display = "block";
    $chatbotInput.focus();
    console.log(this);
    document.getElementById("chat-circle").style.display = "none";

  });
function removeAnimation() {
  $("#content.animation_apply").css("animation-play-state", "paused");

}
const myTimeout = setTimeout(removeAnimation, 5000);

const toggle = (element, klass) => {
  const classes = element.className.match(/\S+/g) || [],
    index = classes.indexOf(klass);
  index >= 0 ? classes.splice(index, 1) : classes.push(klass);
  element.className = classes.join(" ");
};

const getAnswer = (question, qnaId) => {
  fetch(qnaUrl, {
    method: "POST",
    dataType: "json",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Ocp-Apim-Subscription-Key": "3c9725733f9c408a9b7d355837396cf0"
    },
    body: question.trim() !== '' ? JSON.stringify({
      "question": question
    }) : JSON.stringify({
      "qnaId": qnaId
    }),
  })
    .then(response => response.json())
    .then(res => {
      if (res.status < 200 || res.status >= 300) {
        let error = new Error(res.statusText);
        throw error;
      }
      return res;
    })
    .then(res => {
      console.log("res: ", res);
      let response = {
        response: {
          message: res.answers[0].answer,
          payload: { message: "" }
        }
      }
      console.log('Answer', res.answers[0].answer)
      console.log('Answer', res.answers[0].answer.split())
      removeLoader();
      if (res.answers[0].answer.includes("$")) {
        if (res.answers[0].answer.split(" ")[0] == "$$") {
          const mainMessage = res.answers[0].answer.replace('$$', '').trim()
          const btns = `<button type="button" onclick="sendMsg('','Vkk1kHjjtwqD61RsSIxe-6','home','Yes')" >Yes</button> <button type="button"  onclick="sendMsg('','Vkk1kHjjtwqD61RsSIxe-4','home','No')" >No</button>`;
          $chatbotMessages.innerHTML += `<li
          class='is-ai animation'
          id='is-loading'>
        <div class = "message_container">
        <div class = "assigning_margin">
            <div class="is-ai__profile-picture circle">
            </div>
            <div class ="message_content">
            <div>
            <div class='chatbot__message1'>
            <p class = 'chatbot__message'> ${mainMessage}   
              </div>
              </div>
              </div>
              </div>
              <!--Button body--!>
            <div class = "input-body">
            <div class = "button-area" style = "height:auto"> 
            <div class = "optionDiv"> <span class = "option">Choose an option</span> </div>
          <div class= "chatbotBtn">
          ${btns}
          </div>
          </div>
          </div>
          </div>
          </li>`;
          scrollDown()
        } else if (res.answers[0].answer.split(" ")[1] == "bWfzHslepsMsLRYXzKlo-162") {
          nlpData("Would you like to know about Prevent Payment Fraud?", 'cSqQtDFlFd2osmKXhp_y-4', 'home', 'noSourceId', 'noTopic')
          // send("", res.answers[0].answer.split(" ")[1], "Protect_Payments");
        } else if (res.answers[0].answer.split(" ")[1] == "dyWy75i-FhSXQeEBGfzN-10") {
          // send("", res.answers[0].answer.split(" ")[1], "Money_Transfer");
          nlpData("Would you like to know about Transfer Money?", 'cSqQtDFlFd2osmKXhp_y-3', 'home', 'noSourceId', 'noTopic')
        }
        else {
          nlpData("Would you like to know about Deposit Checks?", 'cSqQtDFlFd2osmKXhp_y-5', 'home', 'noSourceId', 'noTopic')
          //send("", res.answers[0].answer.split(" ")[1], "Digital_Payments");
        }
      } else {
        setResponse(response, loadingDelay + aiReplyDelay);
      }
      //aiMessage(loader, true, loadingDelay);
    })
    .catch(error => {
      setResponse(errorMessage, loadingDelay + aiReplyDelay);
      resetInputField();
      console.log(error);
    });
};

const nlpData = (mainMsg, yesSourceId, yesTopic, noSourceId, noTopic) => {
  console.log(mainMsg + yesSourceId + yesTopic + noSourceId + noTopic)
  let mainMessage = mainMsg;
  let btns = `<button type="button" onclick="sendMsg('','${yesSourceId}','${yesTopic}','Yes')" >Yes</button> <button type="button"  onclick="displayNoOptionProduct()" >No</button>`;
  $chatbotMessages.innerHTML += `<li
  class='is-ai animation'
  id='is-loading'>
<div class = "message_container">
<div class = "assigning_margin">
    <div class="is-ai__profile-picture circle">
    </div>
    <div class ="message_content">
    <div>
    <div class='chatbot__message1'>
    <p class = 'chatbot__message'> ${mainMessage}   
      </div>
      </div>
      </div>
      </div>
      <!--Button body--!>
    <div class = "input-body">
    <div class = "button-area" style = "height:auto"> 
    <div class = "optionDiv"> <span class = "option">Choose an option</span> </div>
  <div class= "chatbotBtn">
  ${btns}
  </div>
  </div>
  </div>
  </div>
  </li>`;
  scrollDown()
}

const displayNoOptionProduct = () => {
  const mainMessage = 'Thanks! What product need can I help you with today?<br>Select the options'
  const btns = `<button type="button" onclick="sendMsg('','cSqQtDFlFd2osmKXhp_y-5','home','Deposit Checks')" >Deposit Checks</button> <button type="button" onclick="sendMsg('','cSqQtDFlFd2osmKXhp_y-3','home','Transfer Money')" >Transfer Money</button><button type="button" onclick="sendMsg('','cSqQtDFlFd2osmKXhp_y-4','home','Prevent Payment Fraud')" >Prevent Payment Fraud</button>`;
  $chatbotMessages.innerHTML += `<li
          class='is-ai animation'
          id='is-loading'>
        <div class = "message_container">
        <div class = "assigning_margin">
            <div class="is-ai__profile-picture circle">
            </div>
            <div class ="message_content">
            <div>
            <div class='chatbot__message1'>
            <p class = 'chatbot__message'> ${mainMessage}   
              </div>
              </div>
              </div>
              </div>
              <!--Button body--!>
            <div class = "input-body">
            <div class = "button-area" style = "height:auto"> 
            <div class = "optionDiv"> <span class = "option">Choose an option</span> </div>
          <div class= "chatbotBtn">
          ${btns}
          </div>
          </div>
          </div>
          </div>
          </li>`;
  scrollDown()
}
const initChatbot = (refresh) => {
  if (refresh == 'refresh') {
    $chatbotMessages.innerHTML = '';

  }
  fetch(baseUrl, {
    method: "POST",
    dataType: "json",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      "source": '',
      "topic": '',
      "login": sessionStorage.login
    }),
  })
    .then(response => response.json())
    .then(res => {
      if (res.status < 200 || res.status >= 300) {
        let error = new Error(res.statusText);
        throw error;
      }
      return res;
    })
    .then(res => {
      console.log("res: ", res);
      setResponse(res, loadingDelay + aiReplyDelay);
      //aiMessage(loader, true, loadingDelay);
    })
    .catch(error => {
      setResponse(errorMessage, loadingDelay + aiReplyDelay);
      resetInputField();
      console.log(error);
    });
};

//initChatbot();

const setupChatbot = () => {
  const mainMessage = "Hello, I\u2019m Joey, your dedicated resource to finding the right solution. To get started, please tell me, are you existing user or a new user?"
  const btns = `<button type="button" onclick="login('new')" >New User</button> <button type="button"  onclick="login('existing')" >Existing User</button>`;
  $chatbotMessages.innerHTML += `<li
  class='is-ai animation'
  id='is-loading'>
<div class = "message_container">
<div class = "assigning_margin">
    <div class="is-ai__profile-picture circle">
    </div>
    <div class ="message_content">
    <div>
    <div class='chatbot__message1'>
    <p class = 'chatbot__message'> ${mainMessage}   
      </div>
      </div>
      </div>
      </div>
      <!--Button body--!>
    <div class = "input-body">
    <div class = "button-area" style = "height:auto"> 
    <div class = "optionDiv"> <span class = "option">Choose an option</span> </div>
  <div class= "chatbotBtn">
  ${btns}
  </div>
  </div>
  </div>
  </div>
  </li>`;
}
const userMessage = content => {
  console.log("4");
  console.log("setting up the chat message from user into window");
  $chatbotMessages.innerHTML += `<li class='is-user animation'>
      <p class='chatbot__message'>
        ${content}
      </p>
      <span class='chatbot__arrow chatbot__arrow--right'></span>
    </li>`;
  loader();
  scrollDown();
};
setupChatbot()
const aiMessage = (content, isLoading = false, delay = 0) => {
  console.log("content in ai: ", content);
  console.log("6");

  removeLoader();
  let botResponse = content.response;
  let mainMessage = botResponse.message.replace("XXX", sessionStorage.username)
  let subMessage = (botResponse.payload.message || '').replace("YYY", userprofile[sessionStorage.username].industry).replace("ZZZ", userprofile[sessionStorage.username].revenue).replace("qqq", userprofile[sessionStorage.username].checks).replace("$www", '$' + userprofile[sessionStorage.username].formatamount);
  let btns = "";
  console.log("mainMessage: ", mainMessage);
  if (botResponse.payload.type == "buttons") {
    // $chatbotInput.disabled = true
    // $chatbotInputBox.style.display = "none"
    let buttons = botResponse.payload.value;
    if (buttons.length > 0) {
      buttons.forEach(element => {
        for (var key in element) {
          console.log(key);
          console.log(element[key]);
          let target = element[key];
          let tTopic = botResponse.topic;
          if (key === 'I know what product I want') {
            console.log('in different product', key)
            btns += `<button type="button" class="different"  onclick="btnclick('${target}','${tTopic}','${key}')" >${key}</button>`;
          } else if (key === 'EEEE' || key === 'FFFF' || key === 'GGGG' || key === 'HHHH' || key === 'IIII') {
            if (userprofile[sessionStorage.username].checks < 50 && userprofile[sessionStorage.username].amount < 30000 && key === 'EEEE') {
              btns += `<button type="button" onclick="sendMsg('','${target}','${tTopic}','Yes')" >Yes</button>`;
            } else if (userprofile[sessionStorage.username].checks < 50 && userprofile[sessionStorage.username].amount >= 30000 && key === 'FFFF') {
              btns += `<button type="button" onclick="sendMsg('','${target}','${tTopic}','Yes')" >Yes</button>`;
            } else if ((userprofile[sessionStorage.username].checks >= 50 && userprofile[sessionStorage.username].checks < 300) && userprofile[sessionStorage.username].amount >= 30000 && key === 'GGGG') {
              btns += `<button type="button" onclick="sendMsg('','${target}','${tTopic}','Yes')" >Yes</button>`;
            } else if ((userprofile[sessionStorage.username].checks >= 50 && userprofile[sessionStorage.username].checks < 300) && userprofile[sessionStorage.username].amount < 30000 && key === 'HHHH') {
              btns += `<button type="button" onclick="sendMsg('','${target}','${tTopic}','Yes')" >Yes</button>`;
            } else if (userprofile[sessionStorage.username].checks >= 300 && key === 'IIII') {
              btns += `<button type="button" onclick="sendMsg('','${target}','${tTopic}','Yes')" >Yes</button>`;
            }

          } else {
            btns += `<button type="button"  onclick="btnclick('${target}','${tTopic}','${key}')" >${key}</button>`;
          }
        }
      });
    }
  } else if (botResponse.payload.type == "end") {
    subMessage = ''
    let buttons = botResponse.payload.message.split("/");
    if (buttons.length > 0) {
      let items = ['15%', '25%', '10%', '4%', '7%', '12%']
      let tooltip = {
        "ACH": "ACH allows customers to eliminate paper checks by using electronic transactions with 1-2 days settlement and bulk processing capabilities",
        "Real-time payments": "Real-time Payments allow payment originators to make payments to their trading partners in real-time 24x7",
        "Wire": "Wire Transfer moves funds quickly and securely around the country and the world for immediate availability",
        "Disbursements via Zelle": "Disbursements via Zelle allows businesses of all sizes to initiate low-cost electronic payments to consumer recipients without the hassle of collecting and storing their bank account information",
        "Paper Positive Pay": "Paper Positive Pay is a check payment protection solution that helps you detect check fraud by electronically matching checks to items that you disbursed",
        "ACH Positive Pay": "ACH Positive Pay is an ACH payment protection solution that prevents unauthorized debits against your accounts",
        "Deposit Express": "Deposit Express allows small businesses to deposit checks electronically to their U.S. Bank business accounts using a desktop check scanner and a PC",
        "Mobile Check Deposit": "Mobile Check Deposit allows businesses to deposit checks using a mobile device from a remote location or from their office",
        "On-Site Electronic Deposit": "On-site Electronic Deposit enables businesses that receive check payments at the point of sale, in a walk-up or drop box environment or by mail to branch offices to deposit all check payments electronically",
      }
      let url = {
        "ACH": "https://onlinebanking.usbank.com/Auth/EnrollmentDesktop/Verification|https://appointments.usbank.com/?target-type-appointment=schedule&#/services|https://drive.google.com/file/d/1DSZyM9bASolyXy9qORYS0_vILH39I3Bl/view?usp=sharing",
        "Real-time payments": "https://onlinebanking.usbank.com/Auth/EnrollmentDesktop/Verification|https://appointments.usbank.com/?target-type-appointment=schedule&#/services|https://drive.google.com/file/d/1mThYJlmTik-lYfAu2tiTrtGw2rfz09Pf/view?usp=sharing",
        "Wire": "https://onlinebanking.usbank.com/Auth/EnrollmentDesktop/Verification|https://appointments.usbank.com/?target-type-appointment=schedule&#/services|https://drive.google.com/file/d/1tiPrK_HRi85RO0p_91Ef4mvF9oycWwoq/view?usp=sharing",
        "Disbursements via Zelle": "https://onlinebanking.usbank.com/Auth/EnrollmentDesktop/Verification|https://appointments.usbank.com/?target-type-appointment=schedule&#/services|https://drive.google.com/file/d/19Gji-golk9pzxPBoP5OWRrBWFRSnF-Ao/view;=sharing",
        "Paper Positive Pay": "https://onlinebanking.usbank.com/Auth/EnrollmentDesktop/Verification|https://appointments.usbank.com/?target-type-appointment=schedule&#/services|https://drive.google.com/file/d/1JaNC5pDdO8jbA5ErzxBqXkaTkCMLC6kY/view?usp=sharing",
        "ACH Positive Pay": "https://onlinebanking.usbank.com/Auth/EnrollmentDesktop/Verification|https://appointments.usbank.com/?target-type-appointment=schedule&#/services|https://drive.google.com/file/d/1Py39k4qsTyNRkBBi0RmGtnrrHE4if9rO/view?usp=sharing",
        "Deposit Express": "https://onlinebanking.usbank.com/Auth/EnrollmentDesktop/Verification|https://appointments.usbank.com/?target-type-appointment=schedule&#/services|https://drive.google.com/file/d/1KtVqBe4Haaw4oy6d1eShYwFj5iVpBt8C/view?usp=sharing",
        "Mobile Check Deposit": "https://onlinebanking.usbank.com/Auth/EnrollmentDesktop/Verification|https://appointments.usbank.com/?target-type-appointment=schedule&#/services|https://drive.google.com/file/d/18TREfXxqO7qeOgw9vY6paYHwf3bBXC6p/view?usp=sharing",
        "On-Site Electronic Deposit": "https://onlinebanking.usbank.com/Auth/EnrollmentDesktop/Verification|https://appointments.usbank.com/?target-type-appointment=schedule&#/services|https://drive.google.com/file/d/1Y6jvxs0Vg_4Aa8cuumwiP0-XJQoS34SY/view?usp=sharing",
      }
      buttons.forEach(element => {
        let item = items[Math.floor(Math.random() * items.length)];
        // <button type="button" class="tooltip fade" data-title="Hypertext Markup Language" >${element}<br>(${item} of your peer group uses this product)</button>


        let msg = tooltip[element]
        btns += `<div style="width:calc(50% - 6px)" class="splbtn" >
        <button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="${msg}">${element}<br><br><span style = "font-size: 12px;font-style: italic">(${item} of peers in your industry with similar monthly revenue use this product)</span></button>
        <button type="button" onclick="openURL('${url[element].split("|")[0]}')">Confirm Viability & Apply Online</button>
        <button type="button" onclick="openURL('${url[element].split("|")[1]}')">Schedule a call with a representative</button>
        <button type="button" onclick="openURL('${url[element].split("|")[2]}')">Learn more/FAQs</button></div>`;
      });
    }
  } else {
    // $chatbotInput.disabled = false
    // $chatbotInputBox.style.display = "block"
    console.log("subMessage: ", subMessage);
  }
  $chatbotMessages.innerHTML += `<li
      class='is-ai animation'
      id='${isLoading ? "is-loading" : ""}'>
<div class = "message_container">
<div class = "assigning_margin">
        <div class="is-ai__profile-picture circle">
        </div>
        <div class ="message_content">
        <div>
        <div class='chatbot__message1'>
        <p class = 'chatbot__message'> ${mainMessage}</br>
        ${subMessage || ''}</p>
         
          </div>
          </div>
          </div>
          </div>
          <!--Button body--!>
        <div class = "input-body">
        <div class = "button-area" style = "height:auto"> 
        <div class = "optionDiv"> <span class = "option">Choose an option</span> </div>
      <div class= "chatbotBtn">
      ${btns}
      </div>
      </div>
      </div>
      </div>
      </li>`;

  scrollDown();
};

const btnclick = (target, topic, key) => {

  sessionStorage.target = target;
  sessionStorage.topic = topic;
  sessionStorage.key = key;

  userMessage(key);
  send("", target, topic);

}


const login = (user) => {
  if (user == 'new') {
    sessionStorage.login = false;
    $chatbotLoginIndicator.style.background = "#fff";
    $chatbotLoginIndicator1.style.borderStyle = "none";
    $chatbotLoginIndicator2.style.borderStyle = "none";
    userMessage('New User');
    initChatbot()
  }
  else {
    welcomeMessage()
    //initChatbot()
  }
}

const authentication = () => {
  $chatbotLoginIndicator.style.background = "#1b3281";
  $chatbotLoginIndicator1.style.borderStyle = "none solid none solid";
  $chatbotLoginIndicator1.style.borderColor = "#1b3281";
  $chatbotLoginIndicator2.style.borderStyle = "none solid solid solid";
  $chatbotLoginIndicator2.style.borderColor = "#1b3281";
  $('.formLoginNew').hide();
  sessionStorage.username = $('#userInput').val();
  $chatbotMessages.innerHTML += `<li
  class='is-ai animation'
  id='is-loading'>
<div class = "message_container">
<div class = "assigning_margin">
    <div class="is-ai__profile-picture circle">
    </div>
    <div class ="message_content">
    <div>
    <div class='chatbot__message1'>
    <p class = 'chatbot__message'> You are successfully authenticated  
      </div>
      </div>
      </div>
      </div>
  </li>`;
  sessionStorage.login = true;
  loader()
  initChatbot()
}

const openURL = (url) => {
  window.open(url != 'undefined' ? url : "https://www.usbank.com/about-us-bank/online-security/fraud-prevention.html", "_blank");
}


const removeLoader = () => {
  console.log("7");
  console.log("removing loading icon");
  let loadingElem = document.getElementById("loader-animation");
  if (loadingElem) {
    $chatbotMessages.removeChild(loadingElem);
  }
};

const escapeScript = unsafe => {
  const safeString = unsafe.
    replace(/</g, " ").
    replace(/>/g, " ").
    replace(/&/g, " ").
    replace(/"/g, " ").
    replace(/\\/, " ").
    replace(/\s+/g, " ");
  return safeString.trim();
};

const linkify = inputText => {
  return inputText.replace(urlPattern, `<a href='$1' target='_blank'>$1</a>`);
};

const validateMessage = () => {
  console.log("2");
  const text = $chatbotInput.value;
  const safeText = text ? escapeScript(text) : "";
  console.log("safetext is fetched: ", safeText);
  if (safeText.length && safeText !== " ") {
    resetInputField();
    userMessage(safeText);

    send(safeText);

  }
  scrollDown();
  return;
};

const multiChoiceAnswer = text => {
  const decodedText = text.replace(/zzz/g, "'");
  userMessage(decodedText);
  console.log("5");
  send(decodedText);
  scrollDown();
  return;
};

const setResponse = (val, delay = 0) => {
  console.log("6");
  console.log("Setting response function");
  setTimeout(() => {

    aiMessage(val, true);
  }, delay);
};

const resetInputField = () => {
  console.log("3");
  console.log("resetting the input value");
  $chatbotInput.value = "";
};

const scrollDown = () => {
  console.log("8");
  console.log("scrolling down");

  const distanceToScroll =
    $chatbotMessageWindow.scrollHeight - (
      $chatbotMessages.lastChild.offsetHeight + 60);

  $chatbotMessageWindow.scrollTop = distanceToScroll;
  return false;
};

const send = (text = "", target, topic) => {
  //userMessage(key);
  console.log("5");
  console.log("tgt in send: ", target);
  console.log("topic in send: ", topic);
  if (text.trim() != "" && text.toLowerCase().trim() == sessionStorage.key) {
    target = sessionStorage.target;
    topic = sessionStorage.topic;
    console.log("tgt in if: ", target);
    console.log("topic in if: ", topic);
  }
  if (target && target !== "") {
    console.log('Line 312')
    fetch(baseUrl, {
      method: "POST",
      dataType: "json",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        "source": target,
        "topic": topic,
        "login": sessionStorage.login
      }),
    })
      .then(response => response.json())
      .then(res => {
        if (res.status < 200 || res.status >= 300) {
          let error = new Error(res.statusText);
          throw error;
        }
        return res;
      })
      .then(res => {
        console.log("res: ", res);
        setResponse(res, loadingDelay + aiReplyDelay);
        //aiMessage(loader, true, loadingDelay);
      })
      .catch(error => {
        setResponse(errorMessage, loadingDelay + aiReplyDelay);
        resetInputField();
        console.log(error);
      });
  } else {

    getAnswer(text)
  }
};

const sendMsg = (text = "", target, topic, usrMsg) => {
  userMessage(usrMsg);
  send(text, target, topic);
}


function welcomeMessage() {
  $chatbotMessages.innerHTML +=
    `<div class="formLoginNew">
    <div>
      <h2 class="account_login">
        Account Login
      </h2>
    </div>
  <div>
  <label class="form_control__select">
    <div class="label_text_container">
      <p class="labelText_text">
        Account Type
      </p>
    </div>
    <div class="form_control_select__container">
      <select id="select-62f76fee-97d0-4cae-b82c-0069492f6a9d" name="" class="">
        <option value="1">Online banking</option>
        <option value="2">Online investing</option>
        <option value="3">Business banking</option>
        <option value="4">Corporate &amp; commercial</option>
        <option value="5">Institutional</option>
      </select>
      <div class="helper-text__container" id="helper-62f76fee-97d0-4cae-b82c-0069492f6a9d__container"></div>
    </div>
  </label>
  <div id="aw-personal-id" class="form-control__input">
    <label id="userNameLabel">Username</label>
    <input name="Username" type="text" inputmode="text" id="userInput">
  </div>
  <div id="aw-password" class="form-control__input    show-hide">
  <label id = "passInputLabel">Password</label>
  <input name="Password" type="password" inputmode="text" id="passInput" class="" maxlength="100" pattern=".*" placeholder="" autocomplete="off" aria-invalid="false" value="">
  <button class="usb-button button--text button--small usb-input__show-hide" name="Show" type="button" aria-label="Show Password">Show</button>
  </div>
  <div class="auth-continue-button-align">
  <button  class="usb-button button--primary button--default login-button-continue" name="" type="button" onclick="authentication()">Log in</button></div>
  </div>
  </div>`
  scrollDown();


  $("#userInput").focus(function () {
    // if($(this).id == "userInput"){
    $("#userNameLabel").addClass("is-focused")
    // }else if($(this).id == "passInput"){
    //   $("#passInputLabel").addClass("is-focused")
    // }

  });

  $("#passInput").focus(function () {
    // if($(this).id == "userInput"){
    $("#passInputLabel").addClass("is-focused")
  });


  $("#userInput").focusout(function () {
    // if($(this).id == "userInput"){
    if (!$("#userInput").val()) {
      $("#userNameLabel").removeClass("is-focused")
    }

  });

  $("#passInput").focusout(function () {
    // if($(this).id == "userInput"){
    if (!$("#passInput").val()) {
      $("#passInputLabel").removeClass("is-focused");
    }

  });
  return;

}