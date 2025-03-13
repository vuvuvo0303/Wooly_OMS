import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
      <Lottie animationData={loadingAnimation} loop={true} className="w-40 h-40" />
    </div>
  );
};

export default Loader;
