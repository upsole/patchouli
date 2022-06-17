import { listEntries, deleteEntry } from "../lib/axios";
import { useState, useEffect } from "react";
import Box from "./Box";
import ContainerFlex from "./ContainerFlex";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";
import { getFileSignedUrl } from "../lib/axios";
import { useRouter } from "next/router";

type Entry = any;

const formatTags = (arr: Entry[]) => {
  try {
    return arr.map((e) => {
      e["tags"] = e["tags"].split(",");
      return e;
    });
  } catch (err) {
    return;
  }
};

const filterByK = (arr: Entry[], k: string) => {
  if (k === "all") {
    return arr;
  } else {
    return arr.filter((e) => e.tags.includes(k));
  }
};

const getSetOfTags = (arr: Entry[]) => {
  let set = new Set();
  for (let i = 0; i < arr.length; i++) {
    for (let k in arr[i].tags) {
      set.add(arr[i].tags[k]);
    }
  }
  return ["all", ...set];
};

const LandingEntries: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tags, setTags] = useState(["all"]);
  const [selectedTag, setSelectedTag] = useState("all");
  const { status } = useSession();
  const { data, isLoading } = useQuery(
    "landingEntries",
    () => {
      return listEntries();
    },
    { refetchOnWindowFocus: false, select: formatTags }
  );
  const deleteMutation = useMutation((id: string) => deleteEntry(id), {
    onSuccess: () => queryClient.invalidateQueries("landingEntries"),
  });
  useEffect(() => {
    if (data) {
      const newSet = getSetOfTags(data);
      setTags(newSet);
    }
  }, [data]);
  if (isLoading) return <h3>Loading...</h3>;
  if (data && status === "authenticated") {
    return (
      <>
        <div className="tags">
          {tags.map((t, i) => {
            return (
              <button key={i} onClick={() => setSelectedTag(t)}>
                {t}
              </button>
            );
          })}
        </div>
        <ContainerFlex>
          {data.length > 0 ? (
            filterByK(data, selectedTag).map((entry: Entry) => (
              <Box key={entry.id}>
                <p>
                  {entry.text.slice(0, 100)}
                  {entry.text.length > 100 ? "..." : ""}
                </p>
                <div className="bottom-row">
                  <ul className="tags">
                    {entry.tags.map((t: string, n: number) => {
                      return <li key={n}> {t}</li>;
                    })}
                  </ul>
                  <div className="buttons">
                    {entry.file_key && (
                      <button
                        onClick={async () => {
                          router.push(await getFileSignedUrl(entry.id));
                        }}
                      >
                        Download Document
                      </button>
                    )}
                    <button
                      onClick={() => deleteMutation.mutateAsync(entry.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Box>
            ))
          ) : (
            <Box>
              <h3>Empty List!</h3>
            </Box>
          )}
        </ContainerFlex>
      </>
    );
  } else if (!data) {
    return <h3> Empty List!</h3>;
  } else {
    return <h3> You need to login to access this page </h3>;
  }
};

export default LandingEntries;
