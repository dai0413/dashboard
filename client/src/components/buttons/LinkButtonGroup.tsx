import React from "react";
import LinkButton from "./LinkButton";

type LinkButtonProps = {
  text: string;
  color?: "green" | "red" | "gray";
  onClick?:
    | ((data?: any[] | string) => void)
    | ((data?: any[] | string) => Promise<void>);
  to?: string;
  disabled?: boolean;
};

type LinkButtonGroupProps = {
  approve?: LinkButtonProps;
  deny?: LinkButtonProps;
  reset?: LinkButtonProps;
};

const renderLinkButton = (args: LinkButtonProps) => {
  return (
    <LinkButton
      color={args.color}
      onClick={args.onClick}
      to={args.to}
      disabled={args.disabled}
    >
      {args.text}
    </LinkButton>
  );
};

const LinkButtonGroup: React.FC<LinkButtonGroupProps> = ({
  approve,
  deny,
  reset,
}) => {
  const defaultColors = {
    approve: "green",
    deny: "red",
    reset: "gray",
  } as const;

  return (
    <div className="flex space-x-4">
      {deny &&
        renderLinkButton({
          ...deny,
          color: deny.color || defaultColors["deny"],
        })}
      {reset &&
        renderLinkButton({
          ...reset,
          color: reset.color || defaultColors["reset"],
        })}
      {approve &&
        renderLinkButton({
          ...approve,
          color: approve.color || defaultColors["approve"],
        })}
    </div>
  );
};

export default LinkButtonGroup;
