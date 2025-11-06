import { useQuery, useQueryClient } from "react-query";
import { NewsAndSocialMediaService } from "../services/NewsAndSocialMediaService";

export const useAnnouncementData = ({}) => {
  const client = useQueryClient();

  const fetchAnnouncementData = async () => {
    const tenantId = "br";

    // Fetch help data
    const response = await NewsAndSocialMediaService.makeAnnouncementCall({
      tenantId: tenantId,
    });

    let announcementData = [];
    if (response.status === 200) {
      announcementData = response?.["data"]?.["Announcements"] ?? [];
    }

    return announcementData;
  };

  const result = useQuery(["fetchAnnouncementData"], fetchAnnouncementData, {
    staleTime: Infinity,
    retry: 2,
    //   enabled: !!allFiltersPresent,
  });

  return {
    ...result,
    revalidate: () => client.refetchQueries(["fetchAnnouncementData"]),
  };
};
