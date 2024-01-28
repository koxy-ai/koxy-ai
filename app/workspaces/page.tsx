
import { Button } from "@/components/ui/button"
import getUser from "../actions/user/get"
import getAllWorkspaces from "../actions/workspaces/getAll"
import ErrorPage from "@/components/layout/Errorpage"
import Icon from "@/components/Icon"
import Header from "@/components/header/Header"
import Paths from "@/components/global/Paths"
import Cards from "./cards"
import { defaultLinks } from "@/components/header/HeadLink"

export const runtime = 'edge';

export default async function Workspaces() {

    const user = await getUser();
    const workspaces = await getAllWorkspaces();

    if (!workspaces) {
        return <ErrorPage error="Couldn't fetch workspaces" />
    }

    return (
        <>
            <Header
                user={user}
                links={defaultLinks()}
                activeLink="workspaces"
            />

            <main className="mt-14 min-h-screen">

                <div className="flex items-center w-full p-5 border-b-1 gap-5">
                    <div className="w-full">
                        <Paths user={user} />
                        <h1 className="text-lg font-medium tracking-tight transition-colors">
                            Workspaces
                        </h1>
                    </div>
                    <Button
                        size="sm"
                        className="text-xs gap-2 h-8 pt-0.5 pb-0.5 rounded-[.5rem] pl-4 pr-4 border-border/70"
                        variant="outline2"
                    >
                        <Icon id="book" />
                        Docs
                    </Button>
                    <Button
                        size="sm"
                        variant="power"
                        style={{
                            boxShadow: "0px 0px 3px 0px #6B5DEF"
                        }}
                    >
                        <Icon id="plus" />
                        New workspace
                    </Button>
                </div>

                <Cards workspaces={workspaces} />

            </main>

        </>
    )

}