import { useQuery } from "react-query";
import { LocalizationService } from "../services/AppLocalizationService";
import { getCurrentLanguage } from "../components/Utils";
import { PersistantStorage } from "../Utils/LocalStorage";
import { MdmsService } from "../services/MDMS";

export const useLocalizationStore = ({
  stateCode,
  moduleCode,
  language,
  isAgentUser = false,
}) => {
  return useQuery(
    ["DfsWebstore", stateCode, moduleCode, language],
    async () => {
      let moduleCodes = [];
      if (
        typeof moduleCode !== "string" &&
        (moduleCode[0] === "dfs-schemes" || moduleCode[0].startsWith("SCHEME"))
      )
        moduleCodes = moduleCode;
      else if (typeof moduleCode !== "string")
        moduleCode?.forEach((code) => {
          moduleCodes.push(`dfsweb-${code.toLowerCase()}`);
        });
      const LocalePromise = LocalizationService.getLocale({
        modules:
          typeof moduleCode == "string"
            ? ["dfs-grm-tech-support", "dfs-grm", "rainmaker-hcm-dss", "dfs-scheme-remarks"].includes(
                moduleCode
              )
              ? [moduleCode]
              : [`dfsweb-${moduleCode.toLowerCase()}`]
            : moduleCodes,
        locale: language,
        tenantId: stateCode,
      });
      await LocalePromise;
      return {};
    },
    { enabled: !isAgentUser }
  );
};

export const useInitStore = () => {
  const stateCode = "br";
  const currentLanguage = getCurrentLanguage();
  if (currentLanguage === null) {
    PersistantStorage.set("WebApp.Employee.locale", "en_IN");
  }
  return useQuery(
    ["DfsWebInitStore", stateCode],
    async () => {
      const mdmsResponse = await MdmsService.getInitData(stateCode);

      const LocalePromise = LocalizationService.getLocale({
        modules: [`dfsweb-common`, `dfs-schemes`, `dfs-appliedSchemes`],
        locale: currentLanguage || "en_IN",
        tenantId: stateCode,
      });
      await LocalePromise;

      const releaseInfo =
        mdmsResponse?.["common-masters"]?.ReleaseInfo?.[0] || {};
      const seedSubSchemes =
        mdmsResponse["seed-sub-schemes-en"]?.SeedSubSchemes || {};
      const intiData = {
        releaseInfo,
        seedSubSchemes,
      };
      return intiData;
    },
    {
      staleTime: Infinity,
    }
  );
};
