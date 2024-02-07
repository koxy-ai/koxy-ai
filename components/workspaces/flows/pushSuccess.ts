import FlowStore from "@/scripts/flows/store";
import { toast } from "sonner";

export default function pushSuccess(msg: string, store: FlowStore) {
  toast.success(msg, {
    action: {
      label: "Undo",
      onClick: () => {
        store.undoChange();
      },
    },
  });
  return false;
}
