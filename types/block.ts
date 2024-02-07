interface Block {
  type: "block";
  id: string;
  name: string;
  source: string;
  inputs: Record<string, Record<string, unknown>>;
  next: {
    success?: string;
    failed?: string;
  };
  position: {
    x: number;
    y: number;
  };
}

export default Block;
