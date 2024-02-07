import SourceBlocks from "@/types/sourceBlocks";

class SourceStore {
  source: SourceBlocks[] | undefined;

  constructor(source?: SourceBlocks[]) {
    if (source) {
      this.source = source;
      this.setLocal();
      return;
    }
    this.getLocal();
  }

  getLocal() {
    if (typeof window === "undefined") {
      return;
    }
    const local = sessionStorage.getItem("sourceNodes");
    if (local) {
      this.source = JSON.parse(local);
    }
  }

  setLocal() {
    if (typeof window === "undefined") {
      return;
    }
    if (this.source) {
      sessionStorage.setItem("sourceNodes", JSON.stringify(this.source));
    }
  }

  getOneSource(source: string) {
    const blocks = this.source?.find(
      (block) => block.source.split("/")[0] === source,
    );
    return blocks || [];
  }

  getList() {
    if (!this.source) {
      return {};
    }

    const result: Record<string, Record<string, SourceBlocks>> = {};

    this.source.forEach((block) => {
      const [category, name] = block.source.split("/");
      result[category][name] = block;
    });

    return result;
  }

  getOne(source: string) {
    const block = this.source?.find((block) => block.source === source);
    return block || undefined;
  }
}

export default SourceStore;
