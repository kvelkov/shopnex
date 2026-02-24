import type { MouseEventHandler } from "react";

import { Checkbox, Label } from "@medusajs/ui";
import React from "react";

type CheckboxProps = {
    checked?: boolean;
    "data-testid"?: string;
    id: string;
    label: string;
    name?: string;
    onChange?: MouseEventHandler | undefined;
};

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
    id = "checkbox",
    name,
    checked = true,
    "data-testid": dataTestId,
    label,
    onChange,
}) => {
    return (
        <div className="flex items-center space-x-2">
            <div>
                <Checkbox
                    aria-checked={checked}
                    checked={checked}
                    className="text-base-regular flex items-center gap-x-2"
                    data-testid={dataTestId}
                    id={id}
                    name={name}
                    onClick={onChange}
                    role="checkbox"
                    type="button"
                />
            </div>
            <Label
                className="!transform-none !txt-medium"
                htmlFor="checkbox"
                size="large"
            >
                {label}
            </Label>
        </div>
    );
};

export default CheckboxWithLabel;
