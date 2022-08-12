import { useRouter } from "next/router";
import NextLink from "next/link";

import { useSession } from "next-auth/react";

import ContainerFlex from "~/components/ContainerFlex";

import styles from "~/styles/Login.module.css";

import Box from "~/components/Box";

export default function Verify() {
  const router = useRouter();
  const { status } = useSession();
  if (status === "authenticated") {
    router.push("/");
  } else {
    return (
      <ContainerFlex>
        <Box>
          <div className={styles.verify_box}>
            <h1>Check your email</h1>
            <p>A sign in link has been sent to your email address.</p>
            <div>
              <NextLink href="/" passHref>
                <a>Go back to frontpage</a>
              </NextLink>
            </div>
          </div>
        </Box>
      </ContainerFlex>
    );
  }
}
