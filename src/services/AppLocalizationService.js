import i18next from "i18next";
import { PersistantStorage } from "../Utils/LocalStorage";
import { Request } from "./Request";
import { urls } from "../Utils/Urls";

const LOCALE_LIST = (locale) => `Locale.${locale}.List`;
const LOCALE_ALL_LIST = () => `Locale.List`;
const LOCALE_MODULE = (locale, module) => `Locale.${locale}.${module}`;

const TransformArrayToObj = (traslationList) => {
  return traslationList.reduce(
    // eslint-disable-next-line
    (obj, item) => ((obj[item.code] = item.message), obj),
    {}
  );
  // return trasformedTraslation;
};

const getUnique = (arr) => {
  return arr.filter((value, index, self) => self.indexOf(value) === index);
};

const LocalizationStore = {
  getCaheData: (key) => PersistantStorage.get(key),
  setCacheData: (key, value) => {
    PersistantStorage.set(key, value, 86400);
  },
  getList: (locale) => LocalizationStore.getCaheData(LOCALE_LIST(locale)) || [],
  setList: (locale, namespaces) =>
    LocalizationStore.setCacheData(LOCALE_LIST(locale), namespaces),
  getAllList: () => LocalizationStore.getCaheData(LOCALE_ALL_LIST()) || [],
  setAllList: (namespaces) =>
    LocalizationStore.setCacheData(LOCALE_ALL_LIST(), namespaces),
  store: (locale, modules, messages) => {
    const AllNamespaces = LocalizationStore.getAllList();
    const Namespaces = LocalizationStore.getList(locale);
    modules.forEach((module) => {
      if (!Namespaces.includes(module)) {
        Namespaces.push(module);
        const moduleMessages = messages.filter(
          (message) => message.module === module
        );
        LocalizationStore.setCacheData(
          LOCALE_MODULE(locale, module),
          moduleMessages
        );
      }
    });
    LocalizationStore.setCacheData(LOCALE_LIST(locale), Namespaces);
    LocalizationStore.setAllList(getUnique([...AllNamespaces, ...Namespaces]));
  },
  get: (locale, modules) => {
    const storedModules = LocalizationStore.getList(locale);
    const newModules = modules.filter(
      (module) => !storedModules.includes(module)
    );
    const messages = [];
    storedModules.forEach((module) => {
      const data = LocalizationStore.getCaheData(LOCALE_MODULE(locale, module)) || [];
      messages.push(...data);
    });
    return [newModules, messages];
  },

  updateResources: (messages, locale) => {
    let locales = TransformArrayToObj(messages);
    i18next.addResources(locale, "translation", locales);
  },
};

export const LocalizationService = {
  getLocale: async ({ modules = [], locale = "en_IN", tenantId }) => {
    if (locale.indexOf("_IN") === -1) {
      locale += "_IN";
    }

    const [newModules, messages] = LocalizationStore.get(locale, modules);
    if (newModules.length > 0) {
      const response = await Request({
        url: urls.localization,
        params: { module: newModules.join(","), locale, tenantId },
        useCache: false,
      });
      messages.push(...(response?.data?.messages || []));
      LocalizationStore.store(locale, newModules, response?.data.messages);
    }
    LocalizationStore.updateResources(messages, locale);
    return messages;
  },
  changeLanguage: async (locale, tenantId) => {
    const modules = LocalizationStore.getList(locale);
    let allModules = LocalizationStore.getAllList();
    if (allModules.length === 0) {
      allModules.push('dfsweb-common');
    }
    const uniqueModules = allModules.filter(
      (module) => !modules.includes(module)
    );
    await LocalizationService.getLocale({ modules: uniqueModules, locale, tenantId });
    PersistantStorage.set("WebApp.Employee.locale", locale);
    i18next.changeLanguage(locale);
  },
  updateResources: (messages, locale = "en_IN") => {
    if (locale.indexOf("_IN") === -1) {
      locale += "_IN";
    }
    LocalizationStore.updateResources(messages, locale);
  },
};
