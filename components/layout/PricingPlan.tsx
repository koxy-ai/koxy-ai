"use client"

import { useState } from "react"
import Icon from "@/components/Icon"
import { Button, Heading, Text, Badge, Link } from "@radix-ui/themes"

const flows_and_functions = [
	"15 flows & 20 edge functions",
	"500K AI-powered flows runs",
	"1M edge functions requests",
	"Served from 35 regions"
]

const database_features = [
	"1 Database",
	"850K database read units monthly",
	"400K database write units monthly",
	"Replicated to all 35 regions"
]

const storage_features = [
	"50GB of storage space",
	"50MB max file size"
]

const management_features = [
	"Up to 10 team members",
	"1 custom domain & unlimited free domains",
	"Scalable resources"
]

const realtime_features = [
	"Flows reponses in real-time",
	"1K messages per second"
]

const cron_features = [
	"4 Cron jobs"
]

export default function PricingPlan({ mainFeature }: { mainFeature: string }) {

	const [ type, setType ] = useState<"monthly" | "yearly">("monthly")

	const toggleType = (newType: "monthly" | "yearly") => ( setType(newType) )

	return (
		<div className="innerMain p-14 flex flex-col gap-3 items-center">
			<div className="flex flex-col items-center justify-center gap-3 mb-4">
				<div className="flex flex-col items-center justify-center gap-2">
					<Heading
						align="center"
						size="8"
						className="textGradient"
					>
						Upgrade your workspace now <Icon id="sparkles" size="larger" />
					</Heading>
				</div>
				<Text color="gray" align="center">
					{mainFeature} are only supported in the Pro plan. <Link> Learn more about pricing </Link>
				</Text>
			</div>

			<div className="flex items-center gap-6 p-2 pl-4 pr-4 mb-6 bg-[#31313131] border-1 border-[var(--gray-a5)] rounded-md">
				<Button
					variant={type === "monthly" ? "surface" : "ghost"}
					onClick={() => toggleType("monthly")}
				>
					Monthly
				</Button>
				<Button 
					variant={type === "yearly" ? "surface" : "ghost"}
					onClick={() => toggleType("yearly")}
				>
					Yearly (30% off)
				</Button>
			</div>

			<div className="planContainer">
				<div className="flex items-center w-full sm:flex-col sm:items-start md:items-center md:flex-row">
					<div className="min-w-max flex flex-col gap-4">
						<Badge variant="surface" style={{"maxWidth": "max-content"}}>pro plan</Badge>
						<Heading>{type === "monthly" ? "$19 / month" : "$160 / year (30% off)"}</Heading>
					</div>
					<div className="flex w-full items-center sm:mt-2 md:mt-0 md:justify-end">
						<button className="powerButton">
							Choose plan
						</button>
					</div>
				</div>
				
				<div className="w-full border-t-1 border-[var(--gray-a3)] mb-2 mt-2"></div>
				
				<div className="pricingFeatureSection">
					<PricingFeaturesSection
						title="Flows & edge functions"
						icon="cloud"
						features={flows_and_functions}
					/>
					<PricingFeaturesSection
						title="Database"
						icon="database"
						features={database_features}
					/>
				</div>

				<div className="w-full border-t-1 border-[var(--gray-a3)] mb-2 mt-2"></div>
				
				<div className="pricingFeatureSection">
					<PricingFeaturesSection
						title="Storage"
						icon="package"
						features={storage_features}
					/>
					<PricingFeaturesSection
						title="Management"
						icon="settings"
						features={management_features}
					/>
				</div>
				
				<div className="w-full border-t-1 border-[var(--gray-a3)] mb-2 mt-2"></div>
				
				<div className="pricingFeatureSection">
					<PricingFeaturesSection
						title="Realtime"
						icon="click"
						features={realtime_features}
					/>
					<PricingFeaturesSection
						title="Cron jobs"
						icon="clock-hour-3"
						features={cron_features}
					/>
				</div>

			</div>

			<div className="planContainer mt-4">
				<div className="min-w-max flex flex-col gap-4">
					<Badge variant="surface" style={{"maxWidth": "max-content"}}>team plan</Badge>
					<Heading>Coming soon!</Heading>
					<Text color="gray">
						The team plan is coming soon with more features.
					</Text>
				</div>
			</div>

		</div>
	)
}

function PricingFeaturesSection({ title, icon, features }: { title: string, icon: string, features: Array<string> }) {
	return (
		<div className="w-full flex flex-col gap-4">
			<Text><Icon id={icon} /> {title}</Text>
			<div className="flex flex-col gap-4">
				{features.map(feature => (
					<div key={`feature-${features.indexOf(feature)}`}>
						<PlanFeatureCheck info={feature} />
					</div>
				))}
			</div>
		</div>
	)
}

function PlanFeatureCheck({ info }: { info: string }) {

	return (
		<div className="flex items-center gap-2">
			<div className="text-pink-400 flex items-center justify-center">
				<Icon id="circle-check-filled" size="large" />
			</div>
			<Text size="2" color="gray">{info}</Text>
		</div>
	)

}
