import Block from "./block";
import Condition from "./condition";
import Pointer from "./pointer";

type FlowMap = Record<string, Block | Pointer | Condition>;

export default FlowMap;
