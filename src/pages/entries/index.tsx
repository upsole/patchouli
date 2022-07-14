import ListEntries from "../../components/ListEntries";
import { listEntries } from "~/lib/axios";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";
import LoginWarning from "~/components/NeedToLogin";

const AllEntries: React.FC = () => {
  const { status } = useSession();
  const { data, isLoading } = useQuery(
    ["listEntries", status],
    () => {
      if (status === "authenticated") {
        return listEntries();
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) return <h3>Loading...</h3>;
  if (data && status === "authenticated") {
    return <ListEntries data={data} />;
  } else {
    return  <LoginWarning />
  }
};

export default AllEntries;
