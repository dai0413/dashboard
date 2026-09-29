import { MatchGet } from "../../../../../../../types/models/match";
import { PlayerRegistrationHistoryGet } from "../../../../../../../types/models/player-registration-history";

export const isRegisteredAtMatch = (
  teamId: string,
  registrations: PlayerRegistrationHistoryGet[] | undefined,
  match: MatchGet,
): boolean => {
  if (!match.date || !registrations || registrations.length === 0) {
    return false;
  }

  const teamRegistrations = registrations
    .filter(
      (registration) => registration.team.id === teamId && !!registration.date,
    )
    .sort((a, b) => a.date!.getTime() - b.date!.getTime());

  return teamRegistrations.some((registration, index) => {
    if (registration.registration_type !== "登録") {
      return false;
    }

    const registrationDate = registration.date!.getTime();

    // この「登録」の後にある最初の「抹消」を探す
    const cancellation = teamRegistrations
      .slice(index + 1)
      .find((registration) => registration.registration_type === "抹消");

    const cancellationDate = cancellation?.date?.getTime();

    return (
      match.date!.getTime() >= registrationDate &&
      (cancellationDate === undefined ||
        match.date!.getTime() <= cancellationDate)
    );
  });
};
