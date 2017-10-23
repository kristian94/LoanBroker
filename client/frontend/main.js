const broakerForm = document.forms['broaker'];

// const soap = (function(){
//
//
//     function post(){
//
//     }
//
//     return {
//         post
//     }
//
// })();

const loader = (function(){
    const el = document.querySelector('.loader');

    function show(){
        el.style.opacity = '1'
    }

    function hide(){
        el.style.opacity = '0'
    }

    return {
        show, hide
    }
})();

function disableForm(){
    [].forEach.call(broakerForm.children, (el) => {
        el.disabled = true;
    });
}

broakerForm.addEventListener('submit', function(e){
    e.preventDefault();

    const ssn = broakerForm.ssn.value;
    const amount = broakerForm.amount.value;
    const duration = broakerForm.duration.value;

    const obj = {
        ssn, amount, duration
    };

    disableForm();

    loader.show();
    postBrokerAsyncTest(obj, function(res){
        alert(`recieved following result: ${res}`);
        loader.hide();
    });

    return false;
});

function postBrokerAsyncTest(obj, callback){

    setTimeout(_ => {
        callback('Everything is great!')
    }, 2500)
}


