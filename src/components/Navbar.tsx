import { signIn, signOut, useSession } from "next-auth/react";
import { useDarkMode } from "../lib/darkMode/useDarkMode";
import { FaMoon, FaSun } from "react-icons/fa";
import NextLink from "next/link";
import styles from "~/styles/Navbar.module.css";

const Navbar: React.FC = () => {
  const { data, status } = useSession();
  const [dark, setDark] = useDarkMode();
  return (
    <nav className={styles.navbar}>
      <button onClick={() => setDark(!dark)} className={styles["theme-btn"]}>
        {dark ? <FaSun /> : <FaMoon />}
      </button>
      <div className={styles["nav-btns"]}>
        <NextLink href="/entries/new" passHref>
          <button> + New Entry </button>
        </NextLink>

        <NextLink href="/entries" passHref>
          <button> View All </button>
        </NextLink>
        <NextLink href="/" passHref>
          <button> Home </button>
        </NextLink>
      </div>

      {status === "authenticated" ? (
        <div>
          <p>
            Welcome, <span>{data.user!.name}</span>
          </p>
          <button onClick={() => signOut()} className={styles["sign-btn"]}> Sign Out </button>
        </div>
      ) : (
        <div>
          <p>Not signed in</p>
          <button onClick={() => signIn()} className={styles["sign-btn"]}> Sign In </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
