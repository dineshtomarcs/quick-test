import ClipLoader from "react-spinners/ClipLoader";

export type LoaderProps = {
  color?: string;
  size?: number;
  withoverlay?: boolean;
};

function Loader({
  color = "#a2b4c6",
  size = 40,
  withoverlay = false,
}: LoaderProps) {
  return (
    <div
      className={
        !withoverlay
          ? "sweet-loading"
          : "sweet-loading w-screen h-screen z-50 flex justify-center items-center fixed top-0"
      }
    >
      <ClipLoader color={color} loading size={size} />
    </div>
  );
}

export default Loader;
