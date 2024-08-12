"use client";

import { Watch } from "react-loader-spinner";

export default function Loading() {
  return (
      <div className="flex justify-center mt-20">
        <Watch 
          height="180"
          width="180"
          radius="48"
          color="#4fa94d"
          ariaLabel="watch-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      </div>
  )
};
