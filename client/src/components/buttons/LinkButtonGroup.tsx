import React from "react";
import LinkButton from "./LinkButton";

type LinkButtonProps = {
  text: string;
  color: string;
  onClick?: (data?: any[]) => void;
  to?: string;
};

type LinkButtonGroupProps = {
  approve: LinkButtonProps;
  deny: LinkButtonProps;
  reset?: LinkButtonProps;
};

const renderLinkButton = (args: LinkButtonProps) => {
  return (
    <LinkButton color={args.color} onClick={args.onClick} to={args.to}>
      {args.text}
    </LinkButton>
  );
};

const LinkButtonGroup: React.FC<LinkButtonGroupProps> = ({
  approve,
  deny,
  reset,
}) => {
  return (
    <div className="flex space-x-4">
      {renderLinkButton(deny)}
      {reset && renderLinkButton(reset)}
      {renderLinkButton(approve)}
    </div>
  );
};

export default LinkButtonGroup;
