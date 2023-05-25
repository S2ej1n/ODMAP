function Rating(){};
Rating.prototype.rate=0;
Rating.prototype.setRate=function(newrate){
    this.rate=newrate;
    let items=document.querySelectorAll('.rate_radio');
    items.forEach(function(item,idx){
        if(idx<newrate){
            item.checked=true;
        }
        else{
            item.checked=false;
        }
    });
}
let rating=new Rating();

document.addEventListener('DOMContentLoaded',function(){
    document.querySelector('.rating').addEventListener('click',function(e){
        let elem=e.target;
        if(elem.classList.contains('rate_radio')){
            rating.setRate(parseInt(elem,value));
        }
    })
});

document.querySelector('.review_textarea').addEventListener('keydown',function(){
    let review = document.querySelector('.review_textarea');
    let lengthCheckEx=/^.{400,}$/;
    if(lengthCheckEx.test(review.value)){
        review.value=review.value.substr(0,400);
    }
});
document.querySelector('#save').addEventListener('click',function(e){
    if(rating.rate==0){
        rating.showMessage('rate');
        return false;
    }
    if(document.querySelector('.review_textarea').value.length<5){
        rating.showMessage('review');
        return false;
    
    }
});

Rating.prototype.showMessage=function(type){
    switch(type){
        case 'rate':
            document.querySelector('.review_rating.warning_msg').style.display='block';
            setTimeout(function(){
                document.querySelector('.review_raing.warning_msg').style.display='none';
            },1000);
            break;
        case 'review':
            //안내메시지 표시
            document.querySelector('.review_contents .warning_msg').style.display = 'block';
            //지정된 시간 후 안내 메시지 감춤
            setTimeout(function(){
                document.querySelector('.review_contents .warning_msg').style.display = 'none';
            },1000);    
            break;
    }
}