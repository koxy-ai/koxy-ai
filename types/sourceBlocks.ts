interface SourceBlocks {
    name: string;
    icon: string;
    description: string;
    hasResult: boolean;
    source: string;
    params: { name: string, type: string, typeChange: boolean, ui: any }[];
    result?: string;
}

export default SourceBlocks;