const accessToken = "2d1ddeaadc20462dba88c9beebbe0a21";
const baseUrl = "https://chatbot-py.azurewebsites.net/chatbot";
// const baseUrl = "http://127.0.0.1:5000/chatbot"
const qnaUrl = "https://vcsm-qna-stg-cqa.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=ACP-QNA&api-version=2021-10-01&deploymentName=production";
const sessionId = "1";
const loader = `<span class='loader'><span class='loader__dot'></span><span class='loader__dot'></span><span class='loader__dot'></span></span>`;
const errorMessage = "My apologies, I'm not available at the moment. =^.^=";
const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
const loadingDelay = 700;
const aiReplyDelay = 1800;

const $document = document;
const $chatbot = $document.querySelector(".chatbot");
const $chatbotMessageWindow = $document.querySelector(
  ".chatbot__message-window");

const $chatbotHeader = $document.querySelector(".close_btn");
const $chatbotMessages = $document.querySelector(".chatbot__messages");
const $chatbotInput = $document.querySelector(".chatbot__input");
const $chatbotInputBox = $document.querySelector(".chatbot__entry");
const $chatbotSubmit = $document.querySelector(".chatbot__submit");
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
      if (res.answers[0].answer.includes("$")) {
        if (res.answers[0].answer.split(" ")[1] == "bWfzHslepsMsLRYXzKlo-162") {
          send("", res.answers[0].answer.split(" ")[1], "Protect_Payments");
        }
        else {
          send("", res.answers[0].answer.split(" ")[1], "Digital_Payments");
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

const initChatbot = () => {
  fetch(baseUrl, {
    method: "POST",
    dataType: "json",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
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

initChatbot();

const userMessage = content => {
  console.log("4");
  console.log("setting up the chat message from user into window");
  $chatbotMessages.innerHTML += `<li class='is-user animation'>
      <p class='chatbot__message'>
        ${content}
      </p>
      <span class='chatbot__arrow chatbot__arrow--right'></span>
    </li>`;
  scrollDown();
};

const aiMessage = (content, isLoading = false, delay = 0) => {
  console.log("content in ai: ", content);
  console.log("6");

  //removeLoader();
  let botResponse = content.response;
  let mainMessage = botResponse.message;
  let subMessage = botResponse.payload.message;
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
      let items = ['45%', '65%', '35%', '42%', '37%', '84%', '64%', '65%', '25%']
      buttons.forEach(element => {
        let item = items[Math.floor(Math.random() * items.length)];
        btns += `<div style="width:calc(50% - 6px)" class="splbtn"><button type="button" >${element}<br>(${item} of your peer group uses this product)</button>
        <button type="button" onclick="openURL()">Confirm Viability & Apply Online</button>
        <button type="button" onclick="openURL()">Schedule a call with a representative</button>
        <button type="button" onclick="openURL()">Learn more/FAQs</button></div>`;
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
        ${subMessage}</p>
         
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

const openURL = () => {
  window.open("https://www.usbank.com/about-us-bank/online-security/fraud-prevention.html", "_blank");
}


const removeLoader = () => {
  console.log("7");
  console.log("removing loading icon");
  let loadingElem = document.getElementById("is-loading");
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
        "topic": topic
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
