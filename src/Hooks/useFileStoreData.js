import { useQuery, useQueryClient } from "react-query";
import { dispatchNotification } from "../components/Utils";
import { useDispatch } from "react-redux";
import { trackedFetch } from "./PageLoadHook/trackedFetch";

export const useFileStoreData = ({ url, etag, key }) => {
  const client = useQueryClient();
  const dispatch = useDispatch();

  const fetchFileStoreData = async () => {
    const options = {
      method: "GET",
      headers: {},
    };
    const response = await trackedFetch(url, options, true);

    let data = {};
    if (response.status === 200) {
      data = await response.json();
    } else if (response.status === 304) {
    } else {
      dispatchNotification("error", ["NETWORK_ERROR"], dispatch);
    }

    return data;
  };

  const result = useQuery([key, url], fetchFileStoreData, {
    staleTime: Infinity,
    retry: 2,
  });

  return {
    ...result,
    revalidate: () => client.refetchQueries([key, url]),
  };
};
