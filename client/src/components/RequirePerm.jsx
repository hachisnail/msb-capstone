import { useAuth } from "../context/AuthProvider";

export default function RequirePerm({ perm, children }) {
  const { hasPerm } = useAuth();
  if (!hasPerm(perm)) {
    return (
      <div className="p-3 text-xs flex items-center  justify-center text-gray-200 bg-neutral-900 rounded">
        <span>
          Missing permission: <b>{perm}</b>
        </span>
      </div>
    );
  }
  return children;
}
