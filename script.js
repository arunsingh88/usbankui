const accessToken = "2d1ddeaadc20462dba88c9beebbe0a21";
const baseUrl = "http://usbank-pwc.azurewebsites.net/chatbot";
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

const $chatbotHeader = $document.querySelector(".chatbot__header");
const $chatbotMessages = $document.querySelector(".chatbot__messages");
const $chatbotInput = $document.querySelector(".chatbot__input");
const $chatbotSubmit = $document.querySelector(".chatbot__submit");

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
      // aiMessage(loader, true, loadingDelay);
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
  // setTimeout(() => {
  console.log("6");
  console.log("Inside setTimeOut");
  removeLoader();
  let botResponse = content.response;
  let mainMessage = botResponse.message;
  let subMessage = botResponse.payload.message;
  let btns = "";
  console.log("mainMessage: ", mainMessage);
  if (botResponse.payload.type == "buttons") {
    let buttons = botResponse.payload.value;
    if (buttons.length > 0) {
      buttons.forEach(element => {
        for (var key in element) {
          console.log(key);
          console.log(element[key]);
          let target = element[key];
          let tTopic = botResponse.topic;
          // console.log("botResponse: ",botResponse);
          // let target = {
          //   targetID:element[key],
          //   topic:botResponse.topic
          // };
          // console.log("target: ",target);
          btns += `<button type="button"  onclick="btnclick('${target}','${tTopic}','${key}')" >${key}</button>`;
        }
      });
    }
  } else {

    console.log("subMessage: ", subMessage);

  }

  $chatbotMessages.innerHTML += `<li
      class='is-ai animation'
      id='${isLoading ? "is-loading" : ""}'>
        <div class="is-ai__profile-picture">
          <svg class="icon-avatar" viewBox="0 0 50 50">
            <use xlink:href="#avatar" />
          </svg>
        </div>
        <span class='chatbot__arrow chatbot__arrow--left'></span>
       
        <div class='chatbot__message'>
          ${mainMessage}
          <br/>
          <div class='chatbot__message'>
          ${subMessage}
          <br/>
          <br/>
          ${btns}
        </div>
      </li>`;
  scrollDown();
  // }


  // , delay);
};

const btnclick = (target, topic, key) => {
  console.log("click");

  sessionStorage.target = target;
  sessionStorage.topic = topic;
  sessionStorage.key = key;

  userMessage(key);
  send("", target, topic);

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

    aiMessage(val);
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
      // aiMessage(loader, true, loadingDelay);
    })
    .catch(error => {
      setResponse(errorMessage, loadingDelay + aiReplyDelay);
      resetInputField();
      console.log(error);
    });

};
