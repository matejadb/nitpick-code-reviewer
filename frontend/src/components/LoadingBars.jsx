import { Bars } from "react-loader-spinner";

function LoadingBars() {
  return (
    <div className="flex items-center justify-center">
      <Bars
        height="40"
        width="120"
        color="#2547d0"
        ariaLabel="bars-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
}

export default LoadingBars;
