import { listEntries, deleteEntry } from "../lib/axios";
import Fuse from "fuse.js";
import { useEffect, useState } from "react";
import Box from "./Box";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";

const ListEntries: React.FC = () => {
  const [skip, setSkip] = useState(0);
  const [fuzzyQuery, setFuzzyQuery] = useState("");
  const [entries, setEntries] = useState([]);
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
  const fuse = new Fuse(data as any, { keys: ["text", "tags"] });
  useEffect(() => {
    if (fuzzyQuery) {
      const result = fuse.search(fuzzyQuery);
      setEntries(result.map((e) => e.item));
    } else {
      setEntries(data);
    }
  }, [fuzzyQuery]);
  console.log(entries);

  if (isLoading) return <h3>Loading...</h3>;
  if (entries && status === "authenticated") {
    return (
      <Box stripes>
        <button onClick={() => setSkip(skip + 1)}> + </button>
        <input
          type="text"
          value={fuzzyQuery}
          onChange={(e) => {
            e.preventDefault();
            setFuzzyQuery(e.target.value);
          }}
        />
        <div>
          {entries.map((d) => (
            <div key={d.id} className="borrame">
              <h5>{d.text}</h5>
              <p>{d.tags.split(",")}</p>
            </div>
          ))}
        </div>
      </Box>
    );
  } else if (!entries) {
    return <h3> Empty List!</h3>;
  } else {
    return <h3> You need to login to access this page </h3>;
  }
};

export default ListEntries;
