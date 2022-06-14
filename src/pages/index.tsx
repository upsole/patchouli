import type { NextPage } from "next";
import ListEntries from "../components/ListEntries";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const sessionInfo = useSession();
  return (
    <main>
      <h1>Home Page</h1>

      {sessionInfo.status === "authenticated" ? (
        <>
          <a href="/entries/new">Upload New Entry</a>
          <h2> Signed In </h2>{" "}
          <button onClick={() => signOut()}> Sign Out </button>
        </>
      ) : (
        <>
          <h2> Not Signed In</h2>{" "}
          <button onClick={() => signIn()}> Sign In </button>
        </>
      )}
      <ListEntries />
    </main>
  );
};

export default Home;
