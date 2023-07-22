function resolveAfter2Seconds() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, 2000);
    });
  }

async function asyncCall(next, action) {
    // console.log('calling');
    const result = await resolveAfter2Seconds();
    console.log(result);
    // Expected output: "resolved"

    next(action);
  }

const testMiddleware = storeAPI => next => action => {
    // next(action);

    console.log('hello from middleware before timeout', action);

    asyncCall(next, action);

    console.log('hello from middleware after timeout', action);

    return 42;
}

export default testMiddleware;