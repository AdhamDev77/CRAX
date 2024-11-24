// app/[userId]/edit/RenderWrapper.tsx
import dynamic from "next/dynamic";
import { Config, Data, DefaultComponentProps } from "@measured/puck";

// Define the props interface without onPublish
interface RenderProps {
  config: Config;
  data: Partial<Data<DefaultComponentProps, any> | Data>;
}

// Dynamically import the Render component
const Render = dynamic(() => import("@measured/puck").then((mod) => mod.Render), { ssr: false });

// Create the wrapper component
const RenderWrapper: React.FC<RenderProps> = ({ config, data }) => {
  return <Render config={config} data={data} />;
};

export default RenderWrapper;
