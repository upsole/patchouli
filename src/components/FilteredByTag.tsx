import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { queryEntriesByTag } from "~/lib/axios";
const FilteredComponent: React.FC = () => {
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
  }
  if (data) {
    return (
      <>
        {data.map((d) => {
          return <h3 key={d.id}> {d.text}</h3>;
        })}
      </>
    );
  } else {
    return <h3>Empty</h3>;
  }
};

export default FilteredComponent;
