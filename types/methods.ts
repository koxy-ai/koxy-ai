
type Methods = "get" | "post" | "put" | "patch" | "head" | "options";

const methods: Methods[] = [
    "get",
    "post",
    "put",
    "patch",
    "head",
    "options"
]

const methodsColors: Record<string, string> = {
    get: "green",
    post: "orange",
    put: "blue",
    patch: "purple",
    delete: "red",
    head: "grass",
    options: "pink"
};

export { methods, methodsColors };
export default Methods;