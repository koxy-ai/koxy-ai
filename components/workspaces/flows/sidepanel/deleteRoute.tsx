"use client"

import { useState } from "react";
import { DialogFooter } from "@/components/ui/dialog"
import { Route } from "@/types/flow";
import { Button } from "@/components/ui/button";
import FlowStore from "@/scripts/flows/store";
import EditDialog from "./editDialog";

export default function DeleteRouteDialog({ store }: { store: FlowStore }) {

    const [ route, setRoute ] = useState<Route | undefined>(undefined);
    const [ open, setOpen ] = useState<boolean>(false);
    const [ name, setName ] = useState<string>("");

    store.events.addListener(
        "openRouteDelete",
        "routeDeleteDialog",
        (route: Route) => {
            setRoute(route);
            setOpen(true);
            setName("");
        }
    )

    const deleteAction = () => {
        store.routes.deleteRoute(route as Route);
        setOpen(false);
    }

    return (
        <EditDialog open={open} setOpen={setOpen} icon="trash" color="#ef4444">
            <div className="flex flex-col gap-4 py-4">
                    <input
                        onChange={(e) => {setName((e.target as HTMLInputElement).value)}}
                        type="text"
                        className="border-1 bg-transparent rounded-lg text-xs p-2 outline-0 focus:border-white/30"
                        placeholder="Enter route path to delete it..."
                    />
                    <p className="opacity-70 text-xs">
                        Please enter <b>{route?.path}</b> to confirm the deletion of this route
                    </p>
                </div>
                <DialogFooter>
                    <Button
                        disabled={name !== route?.path}
                        onClick={() => deleteAction()}
                        variant="destructive"
                        size="sm"
                    >
                        Delete route
                    </Button>
                </DialogFooter>
        </EditDialog>
    )

}