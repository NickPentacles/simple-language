const userCode = document.getElementById('user-code')
const responce = document.getElementById('server-responce')
const sendCode = document.getElementById('send-code')
const responceClear = document.getElementById('clear-responce')
const aboutButton = document.getElementById('show-modal')
const aboutModal = document.getElementById('about-modal')
const hideModal = document.getElementById('background-modal')

window.onload = () => {
  userCode.value =  window.sessionStorage.getItem('code') || ""
}

userCode.oninput = () => {
  window.sessionStorage.setItem('code', userCode.value)
}

sendCode.onclick = () => {
    fetch('http://localhost:8000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({text: userCode.value})
    }).then(function (response) {
        return response.json()
      })
      .then(function (data) {
        responce.value += data.text 
      })
}

responceClear.onclick = () => {
  responce.value = ""
}

aboutButton.onclick = () => {
  aboutModal.style.display = 'block'
}

hideModal.onclick = () => {
  aboutModal.style.display = 'none'
}

// do(define(total, 0),
//         define(count, 1),
//         while(<(count, 11),
//             do(define(total, +(total, count)),
//             define(count, +(count, 1)))),
//         print(total))