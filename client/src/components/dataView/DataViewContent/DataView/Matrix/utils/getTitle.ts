import { PlayerAppearanceGet } from "../../../../../../types/models/player-appearance";

type Params = {
  appearance?: PlayerAppearanceGet | undefined;
  onRegister?: boolean;
  calledUp?: boolean;
  title?: string;
};

export const getTitle = ({
  appearance,
  onRegister,
  calledUp,
  title,
}: Params): string => {
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

  if (typeof onRegister === "boolean") {
    if (convertedTitle === "" && onRegister) {
      convertedTitle = "登録中";
    }

    if (convertedTitle === "" && !onRegister) {
      convertedTitle = "登録外";
    }
  }

  if (typeof calledUp === "boolean") {
    if (convertedTitle === "" && calledUp) {
      convertedTitle = "招集";
    }

    if (convertedTitle === "" && !calledUp) {
      convertedTitle = "招集外";
    }
  }

  return convertedTitle;
};
