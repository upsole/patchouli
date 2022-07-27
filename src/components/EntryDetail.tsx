import type { Entry } from "~/types/entities";
import styles from "~/styles/EntryDetail.module.css";
import { deleteEntry } from "~/lib/axios";
import {FaTrash} from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { getFileSignedUrl } from "~/lib/axios";
import Box from "./Box";
const EntryDetailCard: React.FC<{ data: Entry }> = ({ data }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation((id: string) => deleteEntry(id), {
    onSuccess: () => queryClient.invalidateQueries("landingEntries"),
  });
  const router = useRouter();
  return (
    <Box>
      <div className={styles.header}>
        <h3>{data.title}</h3>
        <div className={styles.btns}>
          <button
            onClick={() => {
              deleteMutation.mutateAsync(data.id);
              router.push("/");
            }}
          >
            <FaTrash />
          </button>
          <button onClick={() => alert("Coming Soon")}>EDIT</button>
        </div>
      </div>
      <div className={styles.meta}>
        <div>
          {data.tags.map((t, k) => (
            <p key={k}> {t.name} </p>
          ))}
        </div>
        <p>
          {new Date(data.updatedAt!).toLocaleString("en-IN", {
            month: "long",
            year: "numeric",
            day: "numeric",
          })}
        </p>
      </div>
      <div className={styles.body}>
        <img src={data.img_url || "/placeholder_img.png"} alt={data.title} />
        <div>
          <p>{data.text}</p>
          {data.file_key ? (
            <button
              onClick={async () => {
                router.push(await getFileSignedUrl(data.id));
              }}
            >
              Download Document
            </button>
          ) : (
            <h3> No Document For This Entry </h3>
          )}
        </div>
      </div>
    </Box>
  );
};

export default EntryDetailCard;
