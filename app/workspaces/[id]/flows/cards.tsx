"use client"

import { FlowType } from "@/app/actions/workspaces/listFlows";
import FirstTimeFeature from "@/components/layout/FirstTimeFeature";
import { Button } from "@/components/ui/button";
import Icon from "@/components/Icon";

export default function FlowsCards({ flows }: { flows: FlowType[] | null }) {

    if (!flows || flows.length < 1) {
        return <NoFlows />
    }

    return (
        <></>
    )

}

function NoFlows() {

    return (
        <FirstTimeFeature
            icon="route"
            title="Create your first flow"
            description="
            Edge flows are Serverless APIs built using a no-code builder and served edge-close to your users, 
            can be excuted from your front-end.
            "
        >
            <Button 
                variant="power" 
                size="sm" 
                className="max-w-max powerShadow"
            >
                <Icon id="plus" />
                Create flow
            </Button>
        </FirstTimeFeature>
    )

}