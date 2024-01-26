import getWorkspace from "@/app/actions/workspaces/get"
import listFlows from "@/app/actions/workspaces/listFlows"
import SidePanel from "@/components/sidePanel";
import TopPaths, { PathType } from "@/components/workspaces/topPaths";
import { Text } from "@radix-ui/themes";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import Icon from "@/components/Icon";
import getUser from "@/app/actions/user/get";
import Link from "next/link";

const allowed: { free: number, pro: number } = {
    free: 3,
    pro: 10
}

export default async function NewFlow({ params }: { params: { id: string } }) {

    const user = await getUser();
    const workspace = await getWorkspace(params.id);
    const flows = await listFlows(workspace.id) || [];

    const paths: PathType[] = [
        {
            title: "Flows",
            path: "flows"
        },
        {
            title: "New flow",
            path: "flows/new"
        }
    ];

    const isAllowed = (flows.length < allowed[workspace.plan]);
    if (!isAllowed) {
        return (
            <>
                <SidePanel workspace={workspace} active="flows" />
                <main className="innerMain">
                    <TopPaths workspace={workspace} paths={paths} />
                    <div className="pt-14">
                        <div className="p-5">
                            <Text color="gray" className="flex gap-2 items-center">
                                You can't create more than {flows.length} flows in the {workspace.plan} plan. 
                                <Link href={`/workspace/${workspace.id}/flows`} className="text-power">
                                    Go back
                                </Link>
                            </Text>
                        </div>
                    </div>
                </main>
            </>
        )
    }

    return (
        <>
            <SidePanel workspace={workspace} active="flows" />
            <main className="innerMain">
                <TopPaths workspace={workspace} paths={paths} />
                <div className="pt-14">
                    <div className="p-10 flex items-center justify-center">
                        <div className="border-1 border-border/90 rounded-lg bg-accent/10 max-w-[50%] min-w-[50%]">
                            <div className="p-5 flex flex-col gap-1">
                                <Text size="4" mb="1" className="font-semibold">
                                    Create a new flow
                                </Text>
                                <Text size="2" color="gray">
                                    Your flow will have its own API routes, nodes map, deployments, docs, domains, and analytics.
                                </Text>
                            </div>
                            <div className="p-5 border-t-1 border-border/50 flex flex-col gap-1">
                                <Text size="3">Flow name</Text>
                                <Text size="2" color="gray" mb="3">
                                    Globally unique, Can be changed later. leave empty to generate random.
                                </Text>
                                <Input placeholder="Enter flow name..." type="text" className="text-sm" autoFocus />
                            </div>
                            <div className="p-5 border-t-1 border-border/50 flex flex-col gap-3">
                                <Button variant="power" size="sm" className="max-w-max powerShadow">
                                    Create flow
                                    <Icon id="chevron-right" />
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Text size="2" color="gray">
                                        First deployment will be pushed as {user?.user_metadata?.name || user?.email}
                                    </Text>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </>
    )

}