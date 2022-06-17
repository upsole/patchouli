import { listEntries, deleteEntry } from "../lib/axios";
import Box from "./Box";
import ContainerFlex from "./ContainerFlex";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";
import { getFileSignedUrl } from "../lib/axios";
import { useRouter } from "next/router";

const LandingEntries: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status } = useSession();
  const { data, isLoading } = useQuery(
    "landingEntries",
    () => {
      return listEntries();
    },
    { refetchOnWindowFocus: false }
  );
  const deleteMutation = useMutation((id: string) => deleteEntry(id), {
    onSuccess: () => queryClient.invalidateQueries("landingEntries"),
  });
  if (isLoading) return <h3>Loading...</h3>;
  if (data && status === "authenticated") {
    return (
      <ContainerFlex>
        {data.length > 0 ? (
          data.map((entry: any) => (
            <Box key={entry.id}>
                <p>{entry.text.slice(0, 100)}{entry.text.length>100 ? "..." : ""}</p>
                <div className="bottom-row">
                  <ul className="tags">
                    {entry.tags.split(",").map((t: string, n: number) => {
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
                    <button onClick={() => deleteMutation.mutateAsync(entry.id)}>
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
    );
  } else if (!data) {
    return <h3> Empty List!</h3>;
  } else {
    return <h3> You need to login to access this page </h3>;
  }
};

export default LandingEntries;
