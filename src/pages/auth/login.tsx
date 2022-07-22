import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import {
  getProviders,
  signIn,
  getCsrfToken,
  useSession,
} from "next-auth/react";

import ContainerFlex from "~/components/ContainerFlex";

import styles from "~/styles/Login.module.css";

import Box from "~/components/Box";

interface SignInProps {
  providers: any[];
  csrfToken: string;
}

export default function SignIn(props: SignInProps) {
  const router = useRouter();
  const { status } = useSession();
  if (status === "authenticated") {
    router.push("/");
  } else {
    return (
      <ContainerFlex>
        <Box>
          <div className={styles.container}>
            {Object.values(props.providers).map((provider) => {
              if (provider.name === "Email") {
                return (
                  <form
                    method="post"
                    action="/api/auth/signin/email"
                    key={provider.name}
                    className=""
                  >
                    <input
                      name="csrfToken"
                      type="hidden"
                      defaultValue={props.csrfToken}
                    />
                    <input
                      name="email"
                      id="email"
                      type="email"
                      placeholder="example@email"
                    />
                    <button type="submit">Sign in with email</button>
                  </form>
                );
              }
              return (
                <div key={provider.name}>
                  <button onClick={() => signIn(provider.id)}>
                    Sign in with {provider.name}
                  </button>
                </div>
              );
            })}
          </div>
        </Box>
      </ContainerFlex>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: { providers, csrfToken },
  };
};
