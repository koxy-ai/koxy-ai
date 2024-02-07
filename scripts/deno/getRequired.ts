export default function getRequired() {
  const api = process.env["DENO_API"];
  const org = process.env["DEPLOY_ORG"];
  const token = process.env["DENO_ACCESS_TOKEN"];

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  return {
    api,
    org,
    token,
    headers,
  };
}
