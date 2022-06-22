import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getEntry } from "~/lib/axios";
const EntryDetailCard: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = useQuery(
    ["entryDetail", id],
    () => {
      if (id) {
        return getEntry(id as string);
      }
    },
    { refetchOnWindowFocus: false }
  );

  if (isLoading) {
    return <h3> Loading...</h3>;
  }
  if (data) {
    return <div> {data.title} </div>;
  } else {
    return <h3>Empty</h3>;
  }
};

export default EntryDetailCard;
