import { Result } from "antd";
import Logo from "../../assets/animated-under-construction-image-0050.gif";

export default function UnderDevelopment() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <Result
        icon={
          <div className="flex justify-center">
            <img
              src={Logo}
              alt="Under Development"
              className="w-32 h-32 object-contain"
            />
          </div>
        }
        title="This Page is Under Development"
        subTitle="We're currently working on this feature. Please check back later."
        className="text-center"
      />
    </div>
  );
}
