"use client";

import Image from "next/image";
import { Card, Heading, Flex, Text, Button, Link } from "@radix-ui/themes";
import Icon from "../../components/Icon";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Page() {
  const supabase = createClientComponentClient();

  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  };

  getSession().then((session: any) => {
    if (session) {
      window.location.href = "/";
    }
  });

  const handleAuth = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Card
        variant="surface"
        style={{
          minWidth: 500,
          maxWidth: 500,
          padding: "2rem",
          borderColor: "rgba(255, 255, 255, .5)",
          background: "#23232323",
        }}
      >
        <Flex direction="column" gap="4" align="center">
          <Image
            alt="Koxy AI Logo"
            src="/koxy-white.png"
            width={65}
            height={65}
          />

          <Heading
            size="6"
            style={{
              marginTop: "1rem",
            }}
          >
            Welcome to Koxy AI
          </Heading>
          <Text as="p" size="2" color="gray" align="center">
            Connect your Github account and start building your AI-powered
            serverless back-end
          </Text>

          <Button
            highContrast
            onClick={handleAuth}
            variant="classic"
            size="3"
            style={{
              marginTop: "2rem",
              width: "75%",
            }}
          >
            <Icon id="brand-github-filled" size="larger" />
            Continue with Github
          </Button>

          <Text size="2" mt="2" color="gray">
            By continue your agree to our{" "}
            <Link href="/terms-of-use" target="_blank" size="2">
              Terms of use
            </Link>{" "}
            &{" "}
            <Link href="/privacy-policy" target="_blank" size="2">
              Privacy policy
            </Link>
          </Text>
        </Flex>
      </Card>
    </div>
  );
}
