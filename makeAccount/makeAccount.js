import { authService, createUser } from '../fbase.js';

const $make_account_form = document.querySelector("#make_account_form");
const $email_input = document.querySelector("#email_input");
const $password_input = document.querySelector("#password_input");
const $make_account_btn = document.querySelector("#make_account_btn");
const $error_message = document.querySelector("#error_message");

function handleMakeAccountForm(event) {
  event.preventDefault();
}

async function makeAccount() {
  const email = $email_input.value;
  const password = $password_input.value;
  try {
    const data = await createUser(authService, email, password);
    alert("계정이 생성되었습니다.");
    window.location.href = '../login/login.html';
  } catch (error) {
    console.error("계정 생성 중 오류가 발생했습니다:", error);
    // 오류 발생 시 사용자에게 오류 메시지 표시
    $error_message.innerHTML = error.message;
  }
  $email_input.value = "";
  $password_input.value = "";
}


$make_account_form.addEventListener('submit', handleMakeAccountForm);
$make_account_btn.addEventListener("click", makeAccount);