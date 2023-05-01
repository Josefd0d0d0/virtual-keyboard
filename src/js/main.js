import keyboard from "./used-data"
import "../css/style.css" 

// создаем оболочку для наших клавишь
const container = document.createElement("textarea");
container.className = "textarea";
document.body.append(container);

// создаем клавиши
let currentLanguage = "eng";
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
    updateKeyboard()
  }else {
    const keyElement = keyboard[e.code];
    if (keyElement) {
        const keyName = keyElement.choice_lang?.[currentLanguage][shiftIsDown ? 1 : 0];
        if (keyName !== undefined) {
            displayC(keyName);
        }
    }
}
});


// добавление свойства активному элементу
const keys = document.querySelectorAll(".key");
keys.forEach(key => {
  key.addEventListener("mousedown", e => {
    e.target.classList.add("active");
  });
  key.addEventListener("mouseup", e => {
    e.target.classList.remove("active");
  });
});

document.addEventListener("keydown", e => {
  const keyElement = document.querySelector(`.key.${e.code}`);
  if (keyElement) {
    keyElement.classList.add("active");
  }
});

document.addEventListener("keyup", e => {
  const keyElement = document.querySelector(`.key.${e.code}`);
  if (keyElement) {
    keyElement.classList.remove("active");
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

function handleCapsLock() {
  if (shiftIsDown === false){
    shiftIsDown = true;
    keyCapsLock = true;
    updateKeyboard();
  }else if(shiftIsDown === true){
    shiftIsDown = false;
    keyCapsLock = false;
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
