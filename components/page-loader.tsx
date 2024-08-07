import { BarLoader } from "react-spinners";

export default function PageLoader(props: { text?: string }) {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      {props.text ? <p>{props.text}</p> : null}
      <BarLoader color="#1DB954" height={8} width={250} />
    </div>
  );
}
