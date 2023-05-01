//Dom requests
let keyboard = document.querySelector('.keyboard');
let text = document.querySelector('.textarea');
let rusLetters = document.querySelectorAll('.rus');
let enLetters = document.querySelectorAll('.eng');
let capsLockKey = document.querySelector('.CapsLock');

let language = 'EN';
let capsLock = false;
let specialKeys = {'Backspace':'Backspace', 'Minus':'-', 'Equal':'=', 'Tab':'  ',
  'Space':' ', 'Enter':'\n', 'Backquote':'`', 'ControlLeft':'', 'MetaLeft':'', 'ControlRight':'',
  'AltLeft':'', 'ShiftLeft':'', 'ShiftRight':'', 'Semicolon':';', 'Quote':"'", 'ArrowUp':'\u2191',
  'ArrowLeft':'\u2190', 'ArrowRight':'\u2192', 'ArrowDown':'\u2193', 'CapsLock':'', 'Backslash':'\\',
  'BracketLeft':'[', 'BracketRight':']', 'Slash':'/', 'AltRight':''};

keyboard.addEventListener('click', addSymbol);
capsLockKey.addEventListener('click', determineCapsLockKey);
addEventListener('keydown', addKbdSymbol);

// detremine symbol from virtual keyboard
function determineSymbol() {
  let virtualKey = event.target.closest('div').classList[1];
  let output = '';
  if (virtualKey) {
    if (specialKeys[virtualKey] || specialKeys[virtualKey] == '') {
      output = specialKeys[virtualKey];
    } else {
      output = virtualKey.charAt(virtualKey.length-1).toLowerCase();
    }
  }
  if (language === 'RU') {
    output = rusificator(output);
  }
  if (capsLock) {
    output = output.toUpperCase();
  }
  return output;
}

// add or remove symbol to textarea, mouse handler
function addSymbol() {
  let key = determineSymbol();
  (key === 'Backspace') ? removeSymbol() : text.value += key;
  text.focus();
  text.selectionStart = text.value.length;
}

// remove symbol from textarea
function removeSymbol() {
  text.value = text.value.slice(0, -1);
}

function determineCapsLockKey() {
  (event.getModifierState("CapsLock") || (event.target === capsLockKey && capsLock)) ?
  capsLockKey.classList.add('pressed-key') : capsLockKey.classList.remove('pressed-key');
  capsLock = !capsLock;
 }

function determineShiftKey() {

}

//switch language RU EN
function languageSelector() {
  if ((event.code === 'ControlLeft' && event.altKey === true) || (event.code === 'AltLeft' && event.ctrlKey === true)) {
    language === 'RU' ? language = 'EN': language = 'RU';
    changeLanguage();
  }
}

function determineKbdSymbol() {
 // console.log(event.key, event.altKey);

}

// keyboard handler
function addKbdSymbol() {
  languageSelector();
  determineCapsLockKey();
  determineKbdSymbol();
}

// change language - toggle styles en and ru letters spans
function changeLanguage() {
  rusLetters.forEach((item) => item.classList.toggle('hidden'));
  enLetters.forEach((item) => item.classList.toggle('hidden'));
}

// rus letters output, change eng letter to rus
function rusificator(letter) {
  let engRus = {'q':'й', 'w':'ц', 'e':'у', 'r':'к', 't':'е', 'y':'н', 'u':'г', 'i':'ш', 'o':'щ', 'p':'з', '[':'х', ']':'ъ', '\\':'\\',
    '`':'ё', 'a':'ф', 's':'ы', 'd':'в', 'f':'а', 'g':'п', 'h':'р', 'j':'о', 'k':'л', 'l':'д', ':':'ж', "'":'э',
    'z':'я', 'x':'ч', 'c':'с', 'v':'м', 'b':'и', 'n':'т', 'm':'ь', ',':'б', '.':'ю', '/':'.'}
    return engRus[letter] ? engRus[letter] : letter;
}