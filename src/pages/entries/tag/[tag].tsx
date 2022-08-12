import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { queryEntriesByTag } from "~/lib/axios";
import type { NextPage } from "next";
import ListEntries from "~/components/ListEntries";
import Meta from "~/components/Meta";

const FilteredByTagPage: NextPage = () => {
  const router = useRouter();
  const { tag } = router.query;
  const { data, isLoading } = useQuery(
    ["listEntriesByTag", tag],
    () => {
      if (tag) {
        return queryEntriesByTag(tag as string);
      }
    },
    { refetchOnWindowFocus: false }
  );

  if (isLoading) {
    <h3>Loading...</h3>;
  } else if (data) {
    return (
      <>
        <Meta title={`${tag} tagged entries`} />
        <h3>Entries tagged as {tag}</h3>
        <ListEntries data={data} />
      </>
    );
  }
  return <h3>Empty</h3>;
};

export default FilteredByTagPage;
