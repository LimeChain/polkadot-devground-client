import {
  Link,
  type LinkProps,
} from 'react-router-dom';

interface IPDLink extends LinkProps {}

const PDLink = ({ to, children, ...props } : IPDLink) => {
  return (
    <Link to={to} {...props}>{children}</Link>
  );
};

export default PDLink;