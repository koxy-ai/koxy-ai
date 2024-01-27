import { EventEmitter } from "events";

const flowEvents = new EventEmitter();

type Listeners = {
    component: string,
    cb: Function
}

const listeners: Listeners[] = [];

class Events {
    
    id: string;

    constructor(id: string) {
        this.id = id;
    }
    
    // Push updates
    push(channel: string, msg?: unknown) {
        flowEvents.emit(`${this.id}-${channel}`, msg);
    }

    // Add a listener. used from components and used to not add so many
    // listeners by one component and just update the function the listener points to
    addListener(channel: string, component: string, cb: Function) {

        const exist = listeners
            .filter(listener => listener.component === component)[0];
        ;

        if (exist) {
            listeners[listeners.indexOf(exist)].cb = cb;
            return false;
        }

        listeners.push({ component, cb });
        flowEvents.on(`${this.id}-${channel}`, (msg: unknown) => {
            const event = listeners
                .filter(listener => listener.component === component)[0]
                ;
            if (event?.cb) {
                event.cb(msg);
            }
        })

    }

}

export { Events };
export default flowEvents;