import Breadcrumbs from "../../../../components/ui/Breadcrumbs";
import UnderDevelopment from "../../../Handlers/UnderDevelopment";

export default function ArticleBuilder() {
  return (
    <div className="flex flex-col px-4 py-2">
      <Breadcrumbs />
      <UnderDevelopment />
    </div>
  );
}
