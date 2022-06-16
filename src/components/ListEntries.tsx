import { listEntries, deleteEntry } from "../lib/axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";
import { getFileSignedUrl } from "../lib/axios";
import { useRouter } from "next/router";

// const genterateAnchor = async (id: string) => {
//   const url = await getFileSignedUrl(id);
//   return <a href={url} target="_blank"> Download Document </a>
// }

const ListEntries: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status } = useSession();
  const { data, isLoading } = useQuery(
    "listEntries",
    () => {
      return listEntries();
    },
    { refetchOnWindowFocus: false }
  );
  const deleteMutation = useMutation((id: string) => deleteEntry(id), {
    onSuccess: () => queryClient.invalidateQueries("listEntries"),
  });
  if (isLoading) return <h3>Loading...</h3>;
  if (data && status === "authenticated") {
    return (
      <ul>
        {data.length > 0 ? (
          data.map((entry: any) => (
            <li key={entry.id}>
              <h4>{entry.text}</h4>
              <ul>
                {entry.tags.split(",").map((t, n) => {
                  return <li key={n}> {t} 
                    <button onClick={() => deleteMutation.mutateAsync(entry.id)}> Delete </button>
                  </li>;
                })}
              </ul>
              {entry.file_key && (
                <button
                  onClick={async () => {
                    router.push(await getFileSignedUrl(entry.id));
                  }}
                >
                  Download Document
                </button>
              )}
            </li>
          ))
        ) : (
          <h3> Empty List!</h3>
        )}
      </ul>
    );
  } else if (!data) {
    return <h3> Empty List!</h3>;
  } else {
    return <h3> You need to login to access this page </h3>;
  }
};

export default ListEntries;
