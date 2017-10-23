const broakerForm = document.forms['broaker'];



// console.log(soap)
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

const validation = (function(){
    const inputElList = document.querySelectorAll('input[type=text]');
    const className = 'evaluated';

    function enable(){
        [].forEach.call(inputElList, el => {
            el.addEventListener('keyup', e => {
                const value = el.value;

                if(value.toString().length > 0){
                    el.classList.add(className);
                }else{
                    el.classList.remove(className);
                }
            })
        })

    }

    function formatNumber(number){
        const strIn = number.toString().replace(/\./g, '');
        console.log(strIn);
        const charArr = strIn.split('').reverse();
        const length = charArr.length;
        const revStr = charArr.reduce((sum, el, index) => {
            const addPoint = (index !== 0 && index % 3 === 2 && index+1 != length)
            return addPoint ? sum + el + '.' : sum + el;
        }, '');
        return revStr.split('').reverse().join('');
    }

    return {
        enable, formatNumber
    }
})();



validation.enable();

const ssnInputEl = document.getElementById('ssn');
ssnInputEl.addEventListener('keypress', function(e){
    const value = ssnInputEl.value;
    const isNumber = !isNaN(value);
    const validLength = value.toString().length === 6;
    if(isNumber && validLength){
        ssnInputEl.value = value + '-';
    }
});

const amountInputEl = document.getElementById('amount');
let timeoutId;
amountInputEl.addEventListener('keyup', e => {
    if(timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(_ => {
        const value = amountInputEl.value;
        amountInputEl.value = validation.formatNumber(value);
    }, 350)
});

const resetBtnEl = document.getElementById('reset');
resetBtnEl.addEventListener('click', e => {
    resetForm();
    toggleView();
    disableForm(false);
});

function toggleView(){
    const formView = document.querySelector('.broaker-form-container');
    const resultView = document.querySelector('.broaker-form-results');

    const formViewIsNext = formView.classList.contains('hidden');

    const newView = formViewIsNext ? formView : resultView;
    const currentView = formViewIsNext ? resultView : formView;

    currentView.classList.add('hidden');
    setTimeout(_ => {
        newView.classList.remove('hidden');
    }, 250)
}

function resetForm(){
    broakerForm.ssn.value = '';
    broakerForm.amount.value = '';
    broakerForm.duration.value = '';

}

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

function disableForm(disabled){
    [].forEach.call(broakerForm.children, (el) => {
        el.disabled = disabled;
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

    console.log('passing obj to postBrokeAsync:', obj);

    disableForm(true);
    loader.show();

    //TESTER
    // setTimeout(_ => {
    //     updateResultView({
    //         bankName: 'BorumBorum Bank',
    //         interestRate: 8.125
    //     });
    //     toggleView();
    //     loader.hide();
    // }, 1500);
    //TESTER END

    postBrokeAsync(obj, function(res){
        updateResultView(res);
        toggleView();
        loader.hide();
    }, function(){
        alert('noget gik galt...');
        loader.hide();
    });

    return false;
});

function updateResultView(obj){
    const bankNameEl = document.getElementById('bank-name');
    const interestRateEl = document.getElementById('interest-rate');

    bankNameEl.innerHTML = obj.bankName;
    interestRateEl.innerHTML = `${obj.interestRate} %`;

}

function postBrokeAsync(obj, callback){
    $.soap({
        url: 'http://139.59.211.36:8005/wsdl?wsdl',
        method: 'broke',
        data: obj,
        timeout: 35000,
        success: function (soapResponse) {
            console.log('hello');

            const responseJson = soapResponse.toJSON();

            // accessing the value that holds the actual reponse
            let responseObj = responseJson['#document']['soap:Envelope']['soap:Body']['tns:brokeResponse'];

            const objOut = {};

            // looping the responseobject and adding sanitized key/values to objOut
            for(let key in responseObj){
                if(responseObj.hasOwnProperty(key) && key !== '$'){
                    const index = key.indexOf(':');
                    const newKey = key.substring(index+1);
                    objOut[newKey] = responseObj[key];
                }
            }

            callback(objOut);
        },
        error: function (soapResponse) {
            console.log('noget gik galt???');

            loader.hide();
            // console.log(objOut);

            // show error
        }
    });

}




