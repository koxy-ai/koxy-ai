"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EditDialog from "./editDialog";
import { useState } from "react";
import FlowStore, { HttpMethod } from "@/scripts/flows/store";
import { Route } from "@/types/flow";
import { methods } from "@/types/methods";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AddMethod({ store }: { store: FlowStore }) {

    const [route, setRoute] = useState<Route | undefined>(undefined);
    const [open, setOpen] = useState<boolean>(false);
    const [method, setMethod] = useState<string>("get");

    store.events.addListener(
        "openMethodAdd",
        "methodAdd",
        (route: Route) => {
            setRoute(route);
            setMethod("get");
            setOpen(true);
        }
    )

    const add = () => {
        store.routes.addMethod(route?.id as string, method as HttpMethod);
        setOpen(false);
    }

    return (
        <EditDialog open={open} setOpen={setOpen} icon="plus" color="var(--power)">
            <div className="flex flex-col gap-4 py-4">
                <Select defaultValue={method} onValueChange={setMethod}>
                    <SelectTrigger className="h-auto p-2 rounded-lg text-xs outline-0">
                        <SelectValue
                            className="h-auto p-2 text-xs w-full outline-0 focus:border-white/30"
                            placeholder="Request Method"
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
                </Select>
                <p className="opacity-70 text-xs">Changes will take place in the next deployment</p>
            </div>
            <DialogFooter>
                <Button className="powerShadow" variant="power" size="sm" onClick={add}>Add method</Button>
            </DialogFooter>
        </EditDialog>
    )

}
