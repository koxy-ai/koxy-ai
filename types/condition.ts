export type Operator = "=" | "!=" | "!" | "<" | ">" | "<=" | ">=";

type MainCondition = {
  type: "main";
  operator: Operator;
  operand1: unknown;
  operand2: unknown;
};

type OtherCondition = {
  type: "other";
  logic: "and" | "or";
  operator: Operator;
  operand1: unknown;
  operand2: unknown;
};

interface Condition {
  id: string;
  type: "condition";
  main: MainCondition;
  other: OtherCondition[] | undefined;
  success: string;
  failed: string;
  position: {
    x: number;
    y: number;
  }
}

export default Condition;