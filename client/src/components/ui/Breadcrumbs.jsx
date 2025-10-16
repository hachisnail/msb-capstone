import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

/**
 * Breadcrumbs component
 *
 * Props:
 * - mapping: { [path: string]: string } — optional label overrides
 * - ignore: string[] — additional paths to ignore (merged with defaults)
 */
export default function Breadcrumbs({ mapping = {}, ignore = [] }) {
  const location = useLocation();

  // Default segments to ignore globally
  const defaultIgnore = ["app", "public", "private", "dashboard", "api"];
  const ignoreList = [
    ...new Set([...defaultIgnore, ...ignore.map((i) => i.toLowerCase())]),
  ];

  // Split the path and filter ignored segments
  const pathSnippets = location.pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => !ignoreList.includes(segment.toLowerCase()));

  // Build breadcrumb items dynamically
  const breadcrumbItems = pathSnippets.map((segment, index) => {
    const url = `/app/${pathSnippets.slice(0, index + 1).join("/")}`;
    const label =
      mapping[url] ||
      segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize words

    return {
      title:
        index === pathSnippets.length - 1 ? (
          <span>{label}</span>
        ) : (
          <Link to={url}>{label}</Link>
        ),
    };
  });

  return (
    <>
      <Breadcrumb
        separator="/"
        items={[
          { title: <Link to="/app/dashboard">Dashboard</Link> },
          ...breadcrumbItems,
        ]}
      />
    </>
  );
}
