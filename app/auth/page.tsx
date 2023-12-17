"use client"

import Image from 'next/image';
import { Card, Heading, Flex, Text, Button, Link } from '@radix-ui/themes';
import Icon from '../../components/Icon';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const url = "https://curly-bassoon-566w4rwxp6q3j4-3000.app.github.dev"

export default async function Home() {

    const supabase = createClientComponentClient()
    const {data: {session}} = await supabase.auth.getSession()

    if (session) {
        window.location.href = '/'
    }

    const handleAuth = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${url}/api/auth/callback`
            }
        })
    }

    return (
        <div className='h-screen w-full flex items-center justify-center'>
            <Card
                variant='surface'
                style={{
                    minWidth: 500,
                    maxWidth: 500,
                    padding: "1rem"
                }}
            >
                <Flex direction="column" gap="4">

                    <Image
                        alt="Koxy AI Logo"
                        src="/modern.png"
                        width={40}
                        height={40}
                    />

                    <Heading size="6">Welcome to Koxy AI</Heading>
                    <Text as='p' size="2" color="gray">
                        Connect your Github account and start building your AI-powered serverless back-end
                    </Text>

                    <Button
                        onClick={handleAuth}
                        variant='outline'
                        highContrast
                        size="3"
                        style={{
                            marginTop: "1.2rem"
                        }}
                    >
                        <Icon id="brand-github-filled" size="larger" />
                        Continue with Github
                    </Button>

                    <Text size="2" mt="2" color="gray">
                        By continue your agree to our <Link href='/terms-of-use' target='_blank' size="2">Terms of use</Link> & <Link href='/privacy-policy' target='_blank' size="2">Privacy policy</Link>
                    </Text>

                </Flex>
            </Card>
        </div>
    )
}
