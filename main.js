import { authService } from './fbase.js';

const $login_btn = document.querySelector('#login_btn');
const $logout_btn = document.querySelector('#logout_btn');

function onHandleLogoutBtn() {
  authService.signOut().then(() => {

  }).catch((error) => {
    console.log(error.message);
  })
}

authService.onAuthStateChanged((user) => {
  if (user) {
    console.log(user);
    $logout_btn.style.display = 'block';
    $login_btn.style.display = "none";
  }
  else {
    console.log(user);
    $logout_btn.style.display = 'none';
    $login_btn.style.display = 'block';
  }
})

$logout_btn.addEventListener("click", onHandleLogoutBtn);