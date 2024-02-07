"use client";

import { useState } from "react";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Route } from "@/types/flow";
import { Button } from "@/components/ui/button";
import Methods, { methods } from "@/types/methods";
import FlowStore from "@/scripts/flows/store";
import EditDialog from "./editDialog";

export default function EditRouteDialog({ store }: { store: FlowStore }) {
  const [route, setRoute] = useState<Route | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const [path, setPath] = useState<string>("");

  store.events.addListener("openRouteEditor", "routeEditor", (route: Route) => {
    setRoute(route);
    setPath(route.path);
    setOpen(true);
  });

  const update = () => {
    store.routes.editRoute({
      id: String(route?.id),
      newPath: path,
    });
    setOpen(false);
  };

  return (
    <EditDialog open={open} setOpen={setOpen} icon="edit" color="var(--power)">
      <div className="flex flex-col gap-4 py-4">
        <input
          onChange={(e) => {
            setPath((e.target as HTMLInputElement).value);
          }}
          className="border-1 bg-transparent rounded-lg text-xs p-2 outline-0 focus:border-white/30"
          placeholder="Enter path..."
          defaultValue={route?.path}
        />
        {/* <Select defaultValue={route?.method} onValueChange={setMethod}>
                        <SelectTrigger className="h-auto p-2 rounded-lg text-xs outline-0">
                            <SelectValue
                                className="h-auto p-2 text-xs w-full outline-0 focus:border-white/30"
                                placeholder="Method"
                            />
                        </SelectTrigger>
                        <SelectContent className="outline-0">
                            {methods.map(method => (
                                <SelectItem 
                                    key={`option-${method}-${Date.now()}`}
                                    value={method}
                                >
                                    {method}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select> */}
        <p className="opacity-70 text-xs">
          Changes will take place in the next deployment
        </p>
      </div>
      <DialogFooter>
        <Button
          onClick={() => update()}
          className="powerShadow"
          variant="power"
          size="sm"
        >
          Save changes
        </Button>
      </DialogFooter>
    </EditDialog>
  );
}
