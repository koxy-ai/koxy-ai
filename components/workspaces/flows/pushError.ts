import { toast } from "sonner"

export default function pushError(err: string) {
    toast(err, {
        cancel: {
            label: "Close"
        }
    });
    return false;
}