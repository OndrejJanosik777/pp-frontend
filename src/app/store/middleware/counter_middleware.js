const counterMiddleware = storeAPI => next => action => {
    console.log('COUNTER MIDDLEWARE');

    if (action.type == "counter/increment") {
        console.log('increasing value..');

        next(action);
    }
    else {
        next(action);
    }
}

export default counterMiddleware;