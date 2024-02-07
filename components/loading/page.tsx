import "./style.css";
import Image from "next/image";

type Props = {
  info?: string;
};

export default function LoadingPage({ info }: Props) {
  info = info || "Loading. Please wait...";

  return (
    <div className="flex flex-col items-center justify-center gap-6 transition-all fixed top-0 left-0 w-full h-screen z-30">
      <div className="w-full h-10 pt-3 flex items-center justify-center">
        <div className="loader"></div>
      </div>
      <p id="loadingPageInfo" className="text-sm text-gray-300">
        {info}
      </p>
    </div>
  );
}

export const updateLoading = (info: string) => {
  const elm = document.getElementById("loadingPageInfo");
  if (!elm) {
    return undefined;
  }
  elm.innerText = info;
};
