//Dom requests
let keyboard = document.querySelector('.keyboard');
let text = document.querySelector('.textarea');
let rusLetters = document.querySelectorAll('.rus');
let enLetters = document.querySelectorAll('.eng');
let caseUpLetters = document.querySelectorAll('.case-up');
let caseDownLetters = document.querySelectorAll('.case-down');
let capsLetters = document.querySelectorAll('.caps');
let shiftCapsLetters = document.querySelectorAll('.shift-caps');

//Dom requests special keys
let capsLockKey = document.querySelector('.CapsLock');

// flags and variables
let language = 'EN';
let capsLock = false;
let virtShift = false;
let specialKeys = {'Backspace':'Backspace', 'Minus':'-', 'Equal':'=', 'Tab':'\t',
  'Space':' ', 'Enter':'\n', 'Backquote':'`', 'ControlLeft':'', 'MetaLeft':'', 'ControlRight':'',
  'AltLeft':'',  'Semicolon':';', 'Quote':"'", 'ArrowUp':'\u2191', 'ShiftLeft':'', 'ShiftRight':'',
  'ArrowLeft':'\u2190', 'ArrowRight':'\u2192', 'ArrowDown':'\u2193', 'CapsLock':'', 'Backslash':'\\',
  'BracketLeft':'[', 'BracketRight':']', 'Slash':'/', 'AltRight':'', 'Comma':',', 'Period':'.'};

keyboard.addEventListener('click', addSymbol);
capsLockKey.addEventListener('click', determineCapsLockKey);
addEventListener('keydown', addKbdSymbol);
addEventListener('keyup', removeStyles);

// detremine symbol from virtual keyboard
function determineSymbol() {
  let virtualKey = event.target.closest('div').classList[1];
  let output = '';
  if (virtualKey === 'ShiftRight' || virtualKey === 'ShiftLeft') {
    stylerShift();
    virtShift = true;
    output = '';
  }
  if (virtualKey) {
    if (specialKeys[virtualKey] || specialKeys[virtualKey] == '') {
      output = specialKeys[virtualKey];
    } else {
      output = virtualKey.charAt(virtualKey.length-1).toLowerCase();
    }
  }
  output = caseAndLangTransformer(output);
  return output;
}

// add or remove symbol to textarea, mouse handler
function addSymbol() {
  unStylerShift();
  let key = determineSymbol();
  (key === 'Backspace' || key === 'BACKSPACE') ? removeSymbol() : text.value += key;
  text.focus();
  text.selectionStart = text.value.length;
}

// remove symbol from textarea
function removeSymbol() {
  text.value = text.value.slice(0, -1);
}

function determineCapsLockKey() {
   if ((event.target === capsLockKey || capsLockKey.children) && event.pointerType === 'mouse') {
        capsLockKey.classList.toggle('pressed-special-key');
        capsLock = !capsLock;
        stylerCapsLock();
  }
}

function removeStyles() {
  document.querySelector(`.${event.code}`).classList.remove('pressed-special-key');
  unStylerShift();
}

function addStyles() {
  if (event.code !== 'CapsLock' || event.code !== 'Tab') {
    document.querySelector(`.${event.code}`).classList.add('pressed-special-key');
  }
}

//switch language RU EN
function languageSelector() {
  if ((event.code === 'ControlLeft' && event.altKey === true) || (event.code === 'AltLeft' && event.ctrlKey === true)) {
    language === 'RU' ? language = 'EN': language = 'RU';
    changeLanguage();
  }
}

function determineKbdSymbol() {
  let inputChar = event.code.charAt(event.code.length-1).toLowerCase();
  let specialKeys = ['ControlLeft', 'MetaLeft', 'ControlRight', 'AltLeft', 'AltRight', 'Tab', 'CapsLock'];
  if (specialKeys.includes(event.code)) {
    return '';
  }
  if (event.code === 'Backspace' || event.code === 'BACKSPACE') {
    removeSymbol();
    return '';
  }
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    stylerShift();
    return '';
  }
  if (event.code === 'Tab') {
    event.preventDefault();
    return '\t';
  }
  if (event.code === 'Backquote') {
    return '`';
  }
  return inputChar;
}

// keyboard handler
function addKbdSymbol() {
  let key = determineKbdSymbol();
  languageSelector();
  determineCapsLockKey();
  addStyles();
  key = caseAndLangTransformer(key);
  text.value += key;
}

// change language - toggle styles en and ru letters spans
function changeLanguage() {
  rusLetters.forEach((item) => item.classList.toggle('hidden'));
  enLetters.forEach((item) => item.classList.toggle('hidden'));
}

// rus letters output, change eng letter to rus
function rusificator(letter) {
  let engRus = {'q':'й', 'w':'ц', 'e':'у', 'r':'к', 't':'е', 'y':'н', 'u':'г', 'i':'ш', 'o':'щ', 'p':'з', '[':'х', ']':'ъ', '\\':'\\',
    '`':'ё', 'a':'ф', 's':'ы', 'd':'в', 'f':'а', 'g':'п', 'h':'р', 'j':'о', 'k':'л', 'l':'д', ';':'ж', "'":'э',
    'z':'я', 'x':'ч', 'c':'с', 'v':'м', 'b':'и', 'n':'т', 'm':'ь', ',':'б', '.':'ю', '/':'.'}
    return engRus[letter] ? engRus[letter] : letter;
}

// convert language and case, handler for keys 'Shift' and 'CapsLock' and 'Shift + CapsLock'
function caseAndLangTransformer(letter) {
  let caseEng = {'`':'~', '-':'_', '=':'+', ',':'<', '.':'>', "'":'"', '/':'?', '\\':'|', '[':'{', ']':'}',
  '1':'!', '2':'@', '3':'#', "4":'$', '5':'%', '6':'^', '7':'&', '8':'*', '9':'(', '0':')'};
  let caseRu = {'@':'"', '#':'№', '$':';', '^':':', '&':'?'};
  if (language === 'RU') {
    letter = rusificator(letter);
  }
  if (capsLock) {
    letter = letter.toUpperCase();
  }
  if (event.shiftKey || virtShift) {
    letter = letter.toUpperCase();
    if (caseEng[letter]) {
      letter = caseEng[letter];
    }
    if (language === 'RU' && caseRu[letter]) {
      letter = caseRu[letter];
    }
    if (capsLock) {
      letter = letter.toLowerCase();
    }
  }
  return letter;
}

function stylerCapsLock() {
  if (capsLock) {
    caseDownLetters.forEach(function(item){
      item.classList.add('hidden');
    });
    capsLetters.forEach(function(item){
      item.classList.remove('hidden');
    });
  }
  if (!capsLock) {
    caseDownLetters.forEach(function(item){
      item.classList.remove('hidden');
    });
    capsLetters.forEach(function(item){
      item.classList.add('hidden');
    });
  }
  if (capsLock && event.shiftKey) {
    caseDownLetters.forEach(function(item){
      item.classList.add('hidden');
    });
    capsLetters.forEach(function(item){
      item.classList.add('hidden');
    });
    shiftCapsLetters.forEach(function(item){
      item.classList.remove('hidden');
    });
  }
}

function stylerShift() {
  caseDownLetters.forEach(function(item){
    item.classList.add('hidden');
  });
  caseUpLetters.forEach(function(item){
    item.classList.remove('hidden');
    });
  if (capsLock) {
    console.log('ttt');
    capsLetters.forEach(function(item){
      item.classList.add('hidden');
    });
    shiftCapsLetters.forEach(function(item){
      item.classList.remove('hidden');
    });
    caseUpLetters.forEach(function(item){
      item.classList.add('hidden');
    });
  }
}

function unStylerShift() {
  caseUpLetters.forEach(function(item){
    item.classList.add('hidden');
  });
  if (!capsLock) {
    caseDownLetters.forEach(function(item){
      item.classList.remove('hidden');
    });
  } else {
    caseDownLetters.forEach(function(item){
      item.classList.add('hidden');
    });
    capsLetters.forEach(function(item){
      item.classList.remove('hidden');
    });
    shiftCapsLetters.forEach(function(item){
      item.classList.add('hidden');
    });
  }
  virtShift = false;
}