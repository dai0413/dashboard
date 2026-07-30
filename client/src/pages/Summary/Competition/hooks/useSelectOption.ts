import { useState } from "react";
import { SeasonGet } from "../../../../types/models/season";

export const useSelectOption = () => {
  const [selectedSeason, setSelectedSeason] = useState<SeasonGet | null>(null);

  return {
    selectedSeason,
    setSelectedSeason,
  };
};
