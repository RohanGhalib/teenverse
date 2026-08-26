import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#042113",
          borderRadius: "8px",
          border: "1.5px solid #166B42",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 512 512"
          fill="none"
        >
          <path
            d="M135 110H435L419 190H317L275 402H179L221 190H119L135 110Z"
            fill="#CCFF00"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}

