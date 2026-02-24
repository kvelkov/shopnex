import PolicyTemplate from "@/templates/policy";
import { payloadSdk } from "@/utils/payload-sdk";
import { notFound } from "next/navigation";

type PolicyPageProps = {
    params: Promise<{ policy: string }>;
};

export default async function PolicyPage(props: PolicyPageProps) {
    const params = await props.params;
    const policyResult = await payloadSdk.find({
        collection: "policies",
        limit: 1,
        where: {
            handle: {
                equals: params.policy,
            },
        },
    });
    const policy = policyResult.docs[0];

    if (!policy) {
        notFound();
    }

    return <PolicyTemplate policy={policy} />;
}
