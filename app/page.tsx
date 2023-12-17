import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Flex, Text, Button } from '@radix-ui/themes';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

export default async function Home() {

  const supabase = createServerComponentClient({ cookies })
  const {data: {user}} = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  return (
    <Flex direction="column" gap="2">
      <Text>Hello {user.email}</Text>
      <Button>Let's go</Button>
    </Flex>
  )

}
