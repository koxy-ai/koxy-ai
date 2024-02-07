"use server"

export default async function getBlocksSource() {

    const req = await fetch("https://raw.githubusercontent.com/koxy-ai/brain/main/blocks/config.json", {
        method: "get",
        headers: {
            "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`
        }
    })

    if (!req.ok) {
        return null;
    }

    const source = await req.text();
    return source;

}