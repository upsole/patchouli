import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
  // const {session, loading} = useSession();
  // const {data: session, status} = useSession();
  const sessionInfo = useSession();
  console.log(sessionInfo);
  return (
    <main>
      <h1>Home Page</h1>

      {sessionInfo.status === "authenticated" ? (
        <>
          <h2> Signed In </h2>{" "}
          <button onClick={() => signOut()}> Sign Out </button>
        </>
      ) : (
        <>
          <h2> Not Signed In</h2>{" "}
          <button onClick={() => signIn()}> Sign In </button>
        </>
      )}
    </main>
  );
};

export default Home;
