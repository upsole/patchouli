import type { NextPage } from "next";
import EntryDetailCard from "~/components/EntryDetail";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getEntry } from "~/lib/axios";
import { useSession } from "next-auth/react";

const EntryDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { status } = useSession();
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
    return <h3>Loading ...</h3>;
  }
  if (data && status === "authenticated") {
    return <EntryDetailCard data={data} />;
  }

  return <h3>You must be logged in to view this page </h3>;
};

export default EntryDetail;
