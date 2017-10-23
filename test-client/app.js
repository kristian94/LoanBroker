const ssnCallbacks = (function(){
    const array = [];

    function add(ssn, callback){
        const obj = {ssn};
        obj.callback = fireOnce(ssn, callback);
        array.push(obj);
        logLength();
    }

    function tryRemove(ssn){
        let removed = false;
        array.forEach(function(element, index){
            if(element.ssn === ssn){
                array.splice(index, 1);
                removed = true;
            }
        });
        logLength();
        return removed;
    }

    const fireOnce = (ssn, callback) => (input) => {
        tryRemove(ssn);
        callback(input);
    };

    function get(ssn){
        let returned = '';
        array.forEach(function(element, index){
            if(element.ssn === ssn){
                returned = element;
            }
        });

        return returned;
    }

    function logLength(){
        console.log(array.length)
    }

    function fire(ssn, args){
        const obj = get(ssn);
        if(obj && obj.callback){
            obj.callback(args);
        }else{
            console.info('attempted to fire callback, but was not present');
        }

    }

    return {
        add, fire
    }
})();

// const ssn = '1234'
//
// ssnCallbacks.add(ssn, (obj) => {
//     console.log('CALLBACK!!', obj);
// });
//
// setTimeout(_ => {
//     ssnCallbacks.fire(ssn, {
//         name: 'Kristian'
//     })
// }, 2500);

