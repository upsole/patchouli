import { listEntries } from "../lib/axios";
import Fuse from "fuse.js";
import { useEffect, useState, useMemo } from "react";
import Box from "./Box";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";

import type { Entry } from "~/types";

import styles from "~/styles/ListEntries.module.css";

const ListEntries: React.FC = () => {
  const [skip, _] = useState(0);
  const [fuzzyQuery, setFuzzyQuery] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const { status } = useSession();
  const { data, isLoading } = useQuery(
    ["listEntries", skip],
    () => {
      return listEntries(skip, 10);
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setEntries(data);
      },
    }
  );
  const memoFuse = useMemo(() => {
    const fuse = new Fuse(data as Entry[], { keys: ["title", "tags.name"] });
    return fuse;
  }, [data]);
  // const fuse = new Fuse(data as Entry[], { keys: ["text", "tags"] });
  useEffect(() => {
    if (fuzzyQuery) {
      const result = memoFuse.search(fuzzyQuery);
      setEntries(result.map((e) => e.item));
    } else {
      setEntries(data as Entry[]);
    }
  }, [fuzzyQuery, data, memoFuse]);

  if (isLoading) return <h3>Loading...</h3>;
  if (entries && status === "authenticated") {
    return (
      <Box>
        {/* <button onClick={() => setSkip(skip + 1)}> + </button> */}
        <div className={styles.header}>
          <input
            type="text"
            value={fuzzyQuery}
            placeholder="Search..."
            onChange={(e) => {
              e.preventDefault();
              setFuzzyQuery(e.target.value);
            }}
          />
          <button> TAGS </button>
        </div>
        <table className={styles.table}>
          <tbody>
            {entries.map((d) => (
              <tr key={d.id}>
                <td>{d.title}</td>
                <td>
                  <div>
                    {d.tags.map((t, k: number) => {
                      return <p key={k}>{t.name}</p>;
                    })}
                  </div>
                </td>
                <td>
                  <a href={`entries/${d.id}`}> Details </a>
                </td>
                  <td>
                  {new Date(d.createdAt!).toLocaleString("en-IN", {month: "long", year: "numeric", day: "numeric"})}
                </td>
              </tr>
            ))}
            <tr>
            </tr>
          </tbody>
        </table>
        {/* <div className={styles.stripes}> */}
        {/*   {entries.map((d) => ( */}
        {/*     <div key={d.id}> */}
        {/*       <p>{d.title}</p> */}
        {/*       <div> */}
        {/*         {d.tags.split(",").map((t, k: number) => { */}
        {/*           return <p key={k}>{t}</p>; */}
        {/*         })} */}
        {/*       </div> */}
        {/*       <a href={`entries/${d.id}`}> Detail </a> */}
        {/*       <p> {d.createdAt?.toLocaleLowerCase()}</p> */}
        {/*     </div> */}
        {/*   ))} */}
        {/* </div> */}
      </Box>
    );
  } else if (!entries) {
    return <h3> Empty List!</h3>;
  } else {
    return <h3> You need to login to access this page </h3>;
  }
};

export default ListEntries;
