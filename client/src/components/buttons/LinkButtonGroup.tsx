import React from "react";
import LinkButton from "./LinkButton";

type LinkButtonProps = {
  text: string;
  color: string;
  onClick?: () => void;
  to?: string;
};

type LinkButtonGroupProps = {
  approve: LinkButtonProps;
  deny: LinkButtonProps;
};

const renderLinkButton = (args: LinkButtonProps) => {
  return (
    <LinkButton color={args.color} onClick={args.onClick} to={args.to}>
      {args.text}
    </LinkButton>
  );
};

const LinkButtonGroup: React.FC<LinkButtonGroupProps> = ({ approve, deny }) => {
  return (
    <div className="flex space-x-4">
      {renderLinkButton(approve)}
      {renderLinkButton(deny)}
    </div>
  );
};

export default LinkButtonGroup;
