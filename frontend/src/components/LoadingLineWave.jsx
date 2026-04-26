import { LineWave } from "react-loader-spinner";

function LoadingLineWave() {
  return (
    <div>
      <LineWave
        visible={true}
        height="30"
        width="100"
        color="#ffffff"
        ariaLabel="line-wave-loading"
        wrapperStyle={{}}
        wrapperClass=""
        firstLineColor=""
        middleLineColor=""
        lastLineColor=""
      />
    </div>
  );
}

export default LoadingLineWave;
