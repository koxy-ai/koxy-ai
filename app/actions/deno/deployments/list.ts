"use server";

import getRequired from "@/scripts/deno/getRequired";

export type Options = {
  page: number;
  q?: string;
};

export default async function listDeployments(id: string, options: Options) {
  const { api, headers } = getRequired();
  const { page, q } = options;
  const path = createPath(page, q);

  try {
    const res = await fetch(
      `${api}/projects/${id}/deployments/${path}&order=desc&limit=20`,
      { headers },
    );
    const deployments = await res.json();
    return deployments;
  } catch (err: unknown) {
    return [];
  }
}

function createPath(page: number, q: string | undefined | null) {
  if (q) {
    return `?page=${page}&q=${q}`;
  }
  return `?page=${page}`;
}
