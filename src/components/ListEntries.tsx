import Fuse from "fuse.js";
import { useEffect, useState, useMemo } from "react";
import Box from "./Box";

import type { Entry } from "~/types/entities";

import styles from "~/styles/ListEntries.module.css";

const ListEntries: React.FC<{ data: Entry[] }> = ({ data }) => {
  // const [skip, _] = useState(0);
  const [fuzzyQuery, setFuzzyQuery] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const memoFuse = useMemo(() => {
    const fuse = new Fuse(data as Entry[], { keys: ["title", "tags.name"] });
    return fuse;
  }, [data]);
  useEffect(() => {
    if (fuzzyQuery) {
      const result = memoFuse.search(fuzzyQuery);
      setEntries(result.map((e) => e.item));
    } else {
      setEntries(data as Entry[]);
    }
  }, [fuzzyQuery, data, memoFuse]);

  return (
    <Box>
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
                <a href={`/entries/${d.id}`}> Details </a>
              </td>
              <td>
                {new Date(d.createdAt!).toLocaleString("en-IN", {
                  month: "long",
                  year: "numeric",
                  day: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default ListEntries;
