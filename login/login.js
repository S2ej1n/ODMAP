import { authService, signInWithEmailAndPassword } from '../fbase.js';

const $login_email = document.querySelector("#userid");
const $login_password = document.querySelector("#userpw");
const $login_btn = document.querySelector(".butLogin");

async function onClickLoginBtn(event) {
  event.preventDefault();
  const email = $login_email.value;
  const password = $login_password.value;
  let data
  try {
    data = await signInWithEmailAndPassword(authService, email, password);
    document.cookie = `user=${email}; path=/`
    window.location.href = '../main/main.html';
  } catch (error) {
    console.log(error.message);
  }
}
$login_btn.addEventListener("click", onClickLoginBtn);