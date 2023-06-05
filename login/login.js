import { authService, signAccount } from '../fbase.js';

const $login_email = document.querySelector("#login_email");
const $login_password = document.querySelector("#login_password");
const $login_btn = document.querySelector("#login_btn");

async function onClickLoginBtn() {
  const email = $login_email.value;
  const password = $login_password.value;
  let data
  try {
    data = await signAccount(authService, email, password);
    document.cookie = `user=${email}; path=/`
    window.location.href = '../main/main.html';
  } catch (error) {
    console.log(error.message);
  }
}
$login_btn.addEventListener("click", onClickLoginBtn);