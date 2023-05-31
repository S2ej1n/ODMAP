const main = document.querySelector("#main");                     
const qna = document.querySelector("#qna");

const endPoint = 12;           
var selectedAnswerIndex = -1;                       

//결과로 넘어가는 함수 (진행도표시에는 필요 없음)
function goResult() {
    qna.style.WebkitAnimation = "fadeOut 1s";
    qna.style.animation = "fadeOut 1s";
    setTimeout(() => {
        result.style.WebkitAnimation = "fadeIn 1s";
        result.style.animation = "fadeIn 1s";
        setTimeout(() => {
            qna.style.display = "none";
            result.style.display = "block"
        }, 450)
    })
    setResult();
}

//질문에대한 답 추가하는 함수
function addAnswer(answerText, qIdx, aIdx) {
    var a = document.querySelector('.answerBox');
    var answer = document.createElement('button');
    answer.classList.add('answerList');
    answer.classList.add('my-3');
    answer.classList.add('py-3');
    answer.classList.add('mx-auto');
    answer.classList.add('fadeIn');
    a.appendChild(answer);
    answer.innerHTML = answerText;

    answer.addEventListener("click", function () {
        var children = document.querySelectorAll('.answerList');
        for (let i = 0; i < children.length; i++) {
            children[i].disabled = true;
            children[i].style.WebkitAnimation = "fadeOut 0.5s";
            children[i].style.animation = "fadeOut 0.5s";
        }
        setTimeout(() => {
            for (let i = 0; i < children.length; i++) {
                children[i].style.display = 'none';
            }
            goNext(++qIdx);
        }, 450)

        // Store the selected answer index
        selectedAnswerIndex = aIdx;

        // Enable next button
        var nextButton = document.getElementById('#nextButton');
        nextButton.disabled = false;

        // Remove active class from all answers
        for (let i = 0; i < children.length; i++) {
            children[i].classList.remove('active');
        }

        // Add active class to the selected answer
        answer.classList.add('active');
    }, false);
}


// 다음으로 넘어가는 함수
function goNext(qIdx) {
    var q = document.querySelector('.qBox');
    q.innerHTML = qnaList[qIdx].q;
    

    for (let i in qnaList[qIdx].a) {
        addAnswer(qnaList[qIdx].a[i].answer, qIdx);
    }
    // 진행도 점으로 표시 
    var dots = document.querySelectorAll('.dot');
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }
    dots[qIdx].classList.add('active');
    
    // var status = document.querySelector('.statusBar');
    // status.style.width = (100 / endPoint) * (qIdx + 1) + '%';

    var nexButton = document.getElementById('#nextButton');
    nexButton.disabled = true;
}

 //시작하기 버튼 (진행도 표시에는 필요 없음)
function begin() {                                              
    main.style.WebkitAnimation = "fadeOut 1s";
    main.style.animation = "fadeOut 1s";
    setTimeout(() => {
        qna.style.WebkitAnimation = "fadeIn 1s";
        qna.style.animation = "fadeIn 1s";
        setTimeout(() => {
            main.style.display = "none";                     //시작하기 버튼 누르면 main페이지 안보이고 qna페이지가 나오게
            qna.style.display = "block"
        }, 450)
        let qIdx = 0;
        goNext(qIdx);                                     
    }, 450);
}

//이전질문으로 넘어가는 함수
function prevQuestion() {
    var qIdx = getCurrentQuestionIndex();
    if (qIdx > 0) {
        goNext(qIdx - 1);
    }
}
//다음질문으로 넘어가는 함수
function nextQuestion() {
    var qIdx = getCurrentQuestionIndex();
    if (qIdx < qnaList.length - 1) {
        goNext(qIdx+1);
    } else {
        // Handle the case when all questions have been answered
        goResult();
    }
}

// 현재 질문 얻는 함수 
function getCurrentQuestionIndex() {
    var dots = document.querySelectorAll('.dot');
    for (let i = 0; i < dots.length; i++) {
        if (!dots[i].classList.contains('answered')) {
            return i - 1;
        }
    }
    return dots.length - 1;
}
