import { Button } from "antd";
import UnderDevelopment from "../../Handlers/UnderDevelopment";
export default function HomePage() {
  document.title = "Museo Bulawan";

  return (
    <div>
      {/* <Button type="primary" className="!bg-black !text-gray-500">
        Button
      </Button>*/}
      <UnderDevelopment />
    </div>
  );
}
