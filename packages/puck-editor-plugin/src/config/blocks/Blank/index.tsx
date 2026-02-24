import type { ComponentConfig } from "@/core";

import { getClassNameFactory } from "@/core/lib";
import React from "react";

import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Blank", styles);

export type BlankProps = {};

export const Blank: ComponentConfig<BlankProps> = {
  defaultProps: {},
  fields: {},
  render: () => {
    return <div className={getClassName()}></div>;
  },
};
