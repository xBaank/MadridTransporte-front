import {Link} from "react-router-dom";

export default function LinkReplace({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children?: JSX.Element[] | JSX.Element | string | string[];
}) {
  return (
    <Link className={className} to={to} replace={true}>
      {children}
    </Link>
  );
}
