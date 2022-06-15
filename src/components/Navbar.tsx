import { signIn, signOut, useSession } from "next-auth/react";
import { useDarkMode } from "../lib/darkMode/useDarkMode";
import { FaMoon, FaSun } from "react-icons/fa";
import NextLink from "next/link";

const Navbar: React.FC = () => {
  const { data, status } = useSession();
  const [dark, setDark] = useDarkMode();
  return (
    <nav>
      <button onClick={() => setDark(!dark)} className="theme-btn">
        {dark ? <FaSun /> : <FaMoon />}
      </button>
      <div>
        <NextLink href="entries/new" passHref>
          <button className="nav-btn"> + New Entry </button>
        </NextLink>

        <NextLink href="entries/" passHref>
          <button className="nav-btn"> View All </button>
        </NextLink>
        <NextLink href="/" passHref>
          <button className="nav-btn"> Home </button>
        </NextLink>
      </div>

      {status === "authenticated" ? (
        <div>
          <p>
            Welcome, <span>{data.user!.name}</span>
          </p>
          <button onClick={() => signOut()}> Sign Out </button>
        </div>
      ) : (
        <div>
          <p>Not signed in</p>
          <button onClick={() => signIn()}> Sign In </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
