import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default () => {
  cookies().getAll();
  return createServerComponentClient({ cookies });
};
