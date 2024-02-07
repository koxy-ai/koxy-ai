import { toast } from "sonner";

export default function pushError(err: string) {
  toast.error("Error", {
    description: err,
    cancel: {
      label: "Close",
    },
  });
  return false;
}
