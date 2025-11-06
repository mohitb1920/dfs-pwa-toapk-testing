import BeeKeepingMapping from "./BeeKeepingMapping";
import BKYYMapping from "./BKYYMapping";
import ChaiMapping from "./ChaiMapping";
import DieselMapping from "./DieselMapping";
import HortiMapping from "./HortiMapping";
import InputInfoMapping from "./InputInfoMapping";
import InputSubsidyMapping from "./InputSubsidyMapping";
import MushKitMapping from "./MushKitMapping";
import MushroomMapping from "./MushroomMapping";
import PMKSYMapping from "./PMKSYMapping";
import SabjiMapping from "./SabjiMapping";
import SeedInfoMapping from "./SeedInfoMapping";
import ShushkMapping from "./ShushkMapping";

function MappingBackend(data, id, mdmsId) {
  if (
    [
      "SCHEME014",
      "SCHEME030",
      "SCHEME031",
      "SCHEME032",
      "SCHEME033",
      "SCHEME036",
      "SCHEME045",
      "SCHEME046",
      "SCHEME048",
      "SCHEME049",
      "SCHEME050",
      "SCHEME051",
      "SCHEME052",
      "SCHEME056",
      "SCHEME057",
      "SCHEME058",
      "SCHEME059",
      "SCHEME060",
      "SCHEME062",
      "SCHEME063",
      "SCHEME064",
    ].includes(mdmsId)
  )
    return HortiMapping(data, id, mdmsId);
  else if (["SCHEME001"].includes(mdmsId))
    return PMKSYMapping(data, id, mdmsId);
  else if (
    ["SCHEME004", "SCHEME005", "SCHEME006", "SCHEME027"].includes(mdmsId)
  )
    return InputInfoMapping(data, id, mdmsId);
  else if (["SCHEME007"].includes(mdmsId))
    return SeedInfoMapping(data, id, mdmsId);
  else if (["SCHEME008"].includes(mdmsId))
    return DieselMapping(data, id, mdmsId);
  else if (["SCHEME009", "SCHEME011"].includes(mdmsId))
    return BeeKeepingMapping(data, id, mdmsId);
  else if (["SCHEME010"].includes(mdmsId))
    return MushroomMapping(data, id, mdmsId);
  else if (["SCHEME012"].includes(mdmsId))
    return MushKitMapping(data, id, mdmsId);
  else if (["SCHEME013"].includes(mdmsId))
    return InputSubsidyMapping(data, id, mdmsId);
  else if (["SCHEME015"].includes(mdmsId)) return BKYYMapping(data, id, mdmsId);
  else if (["SCHEME016"].includes(mdmsId)) return ChaiMapping(data, id, mdmsId);
  else if (["SCHEME022"].includes(mdmsId))
    return ShushkMapping(data, id, mdmsId);
  else if (["SCHEME026"].includes(mdmsId))
    return SabjiMapping(data, id, mdmsId);
}
export default MappingBackend;
