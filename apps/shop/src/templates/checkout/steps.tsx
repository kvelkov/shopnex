"use client";

import { usePathname } from "next/navigation";

type StepProps = {
    steps: {
        description: string;
        id: number;
        name: string;
        route: string;
    }[];
};

export const Steps = ({ steps }: StepProps) => {
    const pathname = usePathname();
    const currentStepIndex = steps.findIndex((step) => step.route === pathname);
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div className="flex items-center" key={step.id}>
                        <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                index < currentStepIndex
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : index === currentStepIndex
                                      ? "border-primary text-primary"
                                      : "border-border text-muted-foreground"
                            }`}
                        >
                            <span className="text-sm font-medium">
                                {index < currentStepIndex ? "✓" : step.id}
                            </span>
                        </div>

                        <div className="ml-3">
                            <p
                                className={`text-sm font-medium ${
                                    index === currentStepIndex
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                }`}
                            >
                                {step.name}
                            </p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="hidden sm:block w-24 h-0.5 ml-2 bg-border" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
