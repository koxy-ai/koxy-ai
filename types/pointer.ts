interface Pointer {
  id: string;
  name: string;
  type: "pointer";
  target: string;
  position: {
    x: number;
    y: number;
  };
}

export default Pointer;
