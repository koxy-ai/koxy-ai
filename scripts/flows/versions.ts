import Flow, { Route } from "@/types/flow";

class Versions {

    versions: string = "[]";
    routesSnapshots: Route[] = [];

    get() {
        return JSON.parse(this.versions) as Flow[];
    }

    update(versions: Flow[]) {
        this.versions = JSON.stringify(versions);
    }

    pop() {
        const versions = JSON.parse(this.versions);
        versions.pop();
        this.update(versions);
    }

    makeVerion(flow: Flow) {
        const versions = this.get();
        versions.push(flow);
        this.update(versions);
    }

    undoLatest(): Flow {
        const versions = this.get();
        if (versions.length < 2) {
            return versions[versions.length - 1];
        }
        return versions[versions.length - 1];
    }

    routes = {

        addSnapshot: (route: Route) => {
            this.routesSnapshots.push(route);
        }

    }

}

export default Versions;