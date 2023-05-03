import keyboard from "./used-data"
import "../css/style.css" 

// создаем оболочку для наших клавишь
const container = document.createElement("textarea");
container.className = "textarea";
document.body.append(container);

// создаем клавиши
let currentLanguage = localStorage.getItem('language') || "eng";
localStorage.setItem('language', currentLanguage);

function creationKeyboard(){
  const wrap = document.createElement("div");
  wrap.className = "keyboard-wrapper";
  document.body.appendChild(wrap);

    Object.keys(keyboard).forEach((key)=>{
      const keyName = keyboard[key].choice_lang?.[currentLanguage][0];
      const keyActionsName = keyboard[key].name;

      const keyClassName = key;

      let appointment = keyName;
      let call = "ordinary";
      const keyTag = document.createElement("span");
      if(keyName === undefined){
        appointment = keyActionsName;
         call = "functional";
      }
      keyTag.textContent = `${appointment}`;
      keyTag.className =  `key ${keyClassName} ${call}`;
      wrap.append(keyTag);
    });
}
creationKeyboard();

    const paragraph1 = document.createElement("p");
    const paragraph2 = document.createElement("p");
    const textOne = "Клавиатура создана в операционной системе Windows";
    const textTwo = `Для переключения языка комбинация:ctrl + alt , сейчас язык: ${currentLanguage}`;

    paragraph1.textContent = textOne;
    paragraph2.textContent = textTwo;

    document.body.appendChild(paragraph1);
    document.body.appendChild(paragraph2);


function updateLangText(){
  paragraph2.textContent = `Для переключения языка комбинация:ctrl + alt , сейчас язык: ${currentLanguage}`;
}

let shiftIsDown = false;
let keyCapsLock = false; 

// обновляем значения клавишь
function updateKeyboard() {
    Object.keys(keyboard).forEach((key)=>{
        const keyElement = document.querySelector(`.${key}`);
        if (keyElement) {
            const keyName = keyboard[key].choice_lang?.[currentLanguage][shiftIsDown ? 1 : 0];
            if (keyName !== undefined) {
                keyElement.textContent = keyName;
            }
        }
    })
}

// Ввод текста и замена языка с помощью комбинаций клавишь ctrl + alt
function displayC(char) {
  container.textContent += char;
}

document.addEventListener('keydown', (e)=> {
  if (e.altKey && e.ctrlKey) {
    currentLanguage = currentLanguage === "eng" ? "ru" : "eng";
    localStorage.setItem('language', currentLanguage);
    updateKeyboard()
  } else {
    const keyElement = keyboard[e.code];
    if (keyElement) {
      const keyName = keyElement.choice_lang?.[currentLanguage][shiftIsDown ? 1 : 0];
      if (keyName !== undefined) {
        displayC(keyName);
      }
    }
  }
  updateLangText();
});

// добавление свойства активному элементу

const keys = document.querySelectorAll(".key:not(.CapsLock)");
keys.forEach(key => {
  key.addEventListener("mousedown", e => {
    e.target.classList.add("active");
  });
  key.addEventListener("mouseup", e => {
    e.target.classList.remove("active");
  });
});

document.addEventListener("keydown", e => {
  if (e.code !== "CapsLock") {
    const keyElement = document.querySelector(`.key.${e.code}`);
    if (keyElement) {
      keyElement.classList.add("active");
    }
  }
});

document.addEventListener("keyup", e => {
  if (e.code !== "CapsLock") {
    const keyElement = document.querySelector(`.key.${e.code}`);
    if (keyElement) {
      keyElement.classList.remove("active");
    }
  }
});




// добавление функционала ShiftLeft и ShiftRight
function keyHoldShift(e){
  if ((e.code === 'ShiftLeft'||e.code === 'ShiftRight') && !keyCapsLock) {
    shiftIsDown = true;
    updateKeyboard();
  }
  if ((e.target.classList.contains("ShiftRight")||e.target.classList.contains("ShiftLeft")) && !keyCapsLock) {
    shiftIsDown = true;
    updateKeyboard();
  }
};
function keyReleaseShift(e){
  if ((e.code === 'ShiftLeft'||e.code === 'ShiftRight') && !keyCapsLock) {
    shiftIsDown = false;
    updateKeyboard();
  }
  if ((e.target.classList.contains("ShiftRight")||e.target.classList.contains("ShiftLeft")) && !keyCapsLock) {
    shiftIsDown = false;
    updateKeyboard();
  }
};

document.addEventListener('keydown', keyHoldShift);
document.addEventListener('keyup', keyReleaseShift);
document.addEventListener('mousedown', keyHoldShift);
document.addEventListener('mouseup', keyReleaseShift)


// добавление функционала CapsLock
const capsLockKey = document.querySelector(".CapsLock");
function handleCapsLock() {
  if (shiftIsDown === false){
    shiftIsDown = true;
    keyCapsLock = true;
    capsLockKey.classList.add("active");
    updateKeyboard();
  }else if(shiftIsDown === true){
    shiftIsDown = false;
    keyCapsLock = false;
    capsLockKey.classList.remove("active");
    updateKeyboard();
  } 
};

document.querySelector(".CapsLock").addEventListener("click",handleCapsLock);
document.addEventListener("keydown", (e) => {
  if (e.code === "CapsLock") {
      handleCapsLock();
  }
});


// добавление функционала Space

function useSpace (e){
  if (e.code === "Space"){
    container.textContent += " ";
  }
  if(e.target.classList.contains("Space")){
    container.textContent += " ";
  }
  if (e.code === "Enter") {
    container.textContent += "\n";
  }
  if(e.target.classList.contains("Enter")){
    container.textContent += "\n";
  }
};

let backspaceInterval;

function handleBackspace() {
  const remove = container.textContent.split("");
  if (remove.length > 0) {
    remove.pop();
    container.textContent = remove.join("");
  }
}

document.addEventListener("keydown", (e)=> {
  if (e.code === "Backspace") {
    handleBackspace();
    backspaceInterval = setInterval(handleBackspace, 50);
  }
});

document.addEventListener("keyup", (e)=> {
  if (e.code === "Backspace") {
    clearInterval(backspaceInterval);
  }
});

document.querySelector(".Backspace").addEventListener("mousedown", ()=> {
  handleBackspace();
  backspaceInterval = setInterval(handleBackspace, 50);
});

document.querySelector(".Backspace").addEventListener("mouseup", ()=> {
  clearInterval(backspaceInterval);
});

document.querySelector(".Space").addEventListener("click",useSpace);
document.querySelector(".Enter").addEventListener("click",useSpace);
document.querySelector(".Delete").addEventListener("click",useSpace);
document.querySelector(".Backspace").addEventListener("click",useSpace);
document.addEventListener("keydown", useSpace);


document.querySelector(".keyboard-wrapper").addEventListener("click", (e) => {
  if (e.target.classList.contains("ArrowLeft")) {
    container.value += keyboard.ArrowLeft.name;
  } else if (e.target.classList.contains("ArrowRight")) {
    container.value += keyboard.ArrowRight.name;
  } else if (e.target.classList.contains("ArrowUp")) {
    container.value += keyboard.ArrowUp.name;
  } else if (e.target.classList.contains("ArrowDown")) {
    container.value += keyboard.ArrowDown.name;
  }
});

document.querySelector(".keyboard-wrapper").addEventListener("click", (e) =>{
  if(e.target.classList.contains("ordinary")){
    const cursorPosition = container.selectionEnd;
    container.setRangeText(e.target.textContent, cursorPosition, cursorPosition, "end");
    container.focus();
  }else if (e.target.classList.contains("Backspace")) {
    const cursorPosition = container.selectionEnd;
    if (cursorPosition > 0) {
      container.setRangeText("", cursorPosition - 1, cursorPosition, "end");
      container.focus();
    }
  }
 else if (e.target.classList.contains("Delete")) {
  const cursorPosition = container.selectionEnd;
  container.setRangeText("", cursorPosition, cursorPosition + 1, "end");
  container.focus();
} else if (e.target.classList.contains("Space")) {
  const cursorPosition = container.selectionEnd;
  container.setRangeText(" ", cursorPosition, cursorPosition, "end");
  container.focus();
} else if (e.target.classList.contains("Tab")) {
  const cursorPosition = container.selectionEnd;
  container.setRangeText("\t", cursorPosition, cursorPosition, "end");
  container.focus();
}
else if (e.target.classList.contains("Enter")) {
  const cursorPosition = container.selectionEnd;
  container.setRangeText("\n", cursorPosition, cursorPosition, "end");
  container.focus();
}
});
