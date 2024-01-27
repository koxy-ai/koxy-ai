
/*
    This did not work because we can't JSON.stringify a function (cb).
*/

type Listener = {
    component: string,
    cb: Function
}

const listListeners = () => {
    return JSON.parse(sessionStorage.getItem("flow-editor-listeners") || "[]") as Listener[];
}

const updatesListeners = (listeners: Listener[]) => {
    sessionStorage.setItem("flow-editor-listeners", JSON.stringify(listeners));
}

const getListener = (component: string) => {
    const data = listListeners();
    return data
        .filter(listener => listener.component === component)[0];
}

const addListener = (listener: Listener) => {
    const exist = getListener(listener.component);
    const allListeners = listListeners();

    if (exist) {
        allListeners[allListeners.indexOf(exist)].cb = listener.cb;
    } else {
        allListeners.push(listener);
    }

    updatesListeners(allListeners);
}

export {
    getListener,
    addListener
}