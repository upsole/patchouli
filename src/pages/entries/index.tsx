import ListEntries from "../../components/ListEntries";
import { listEntries } from "~/lib/axios";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";

const AllEntries: React.FC = () => {
  const { status } = useSession();
  const { data, isLoading } = useQuery(
    ["listEntries"],
    () => {
      return listEntries();
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) return <h3>Loading...</h3>;
  if (data && status === "authenticated") {
    return <ListEntries data={data} />;
  } else if (!data) {
    return <h3> Empty List!</h3>;
  } else {
    return <h3> You need to login to access this page </h3>;
  }
};

export default AllEntries;
