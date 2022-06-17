import { listEntries, deleteEntry } from "../lib/axios";
import Fuse from "fuse.js";
import { useEffect } from "react";
import Box from "./Box";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";

const useListEntryQuery = (skip: number) => {
  const queryInfo = useQuery(
    ["listEntries", skip],
    () => {
      return listEntries(skip, 15);
    },
    { refetchOnWindowFocus: false }
  );
  return queryInfo;
};

const ListEntries: React.FC = () => {
  const [skip, setSkip] = useState(0);
  // const [searchQuery, setSearchQuery] = useState("");
  // const [filtered, setFiltered] = useState([]);
  const { status } = useSession();
  const { data, isLoading } = useListEntryQuery(skip);


  if (isLoading) return <h3>Loading...</h3>;
  if (data && status === "authenticated") {
    return (
      <Box stripes>
        <button onClick={() => setSkip(skip + 1)}> + </button>
        {/* <input */}
        {/*   type="text" */}
        {/*   value={searchQuery} */}
        {/*   onChange={(e) => { */}
        {/*     e.preventDefault(); */}
        {/*     setSearchQuery(e.target.value); */}
        {/*   }} */}
        {/* /> */}
        <div>
          {data.map((d) => (
            <h5>{d.text}</h5>
          ))}
        </div>
      </Box>
    );
  } else if (!data) {
    return <h3> Empty List!</h3>;
  } else {
    return <h3> You need to login to access this page </h3>;
  }
};

export default ListEntries;
