import type { NextPage } from "next";
import ListEntries from "../components/ListEntries";
import { signIn, signOut, useSession } from "next-auth/react";
import { useDarkMode } from "../lib/darkMode/useDarkMode";

const Home: NextPage = () => {
  const sessionInfo = useSession();
  const [darkTheme, setDarkTheme] = useDarkMode();
  return (
    <main>
      <h1>Home Page</h1>
      <button onClick={() => setDarkTheme(!darkTheme)}>
        Switch Theme
      </button>

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
