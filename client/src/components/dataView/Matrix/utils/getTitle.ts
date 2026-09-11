import { PlayerAppearanceGet } from "../../../../types/models/player-appearance";

export const getTitle = (
  appearance: PlayerAppearanceGet | undefined,
  onRegister: boolean,
  calledUp: boolean,
  title?: string,
): string => {
  let convertedTitle = title || "";

  if (appearance) {
    const { time, play_status, position } = appearance;

    if (play_status === "サブ") {
      convertedTitle = `途中 - ${time}分`;
    }

    if (play_status === "スタメン") {
      convertedTitle = `先発 - ${position} - ${time}分`;
    }

    if (play_status === "ベンチ") {
      convertedTitle = "ベンチ";
    }
  }

  if (convertedTitle === "" && onRegister) {
    convertedTitle = "登録中";
  }

  if (convertedTitle === "" && !calledUp) {
    convertedTitle = "招集外";
  }

  if (convertedTitle === "" && calledUp) {
    convertedTitle = "招集";
  }

  return convertedTitle;
};
