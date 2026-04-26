import { InfinitySpin } from "react-loader-spinner";

function LoadingSpinner() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-neutral-700">
      <InfinitySpin width="200" color="#2547d0" />
    </div>
  );
}

export default LoadingSpinner;
