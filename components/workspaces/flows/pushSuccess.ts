import FlowStore from "@/scripts/flows/store";
import { toast } from "sonner"

export default function pushSuccess(msg: string) {
    toast.success(msg, {
        cancel: {
            label: "Close",
        }
    });
    return false;
}