import ErrorIcon from "@mui/icons-material/Error";

export default function StaledMessage({message}: {message: string}) {
  return (
    <>
      <div className="flex items-center m-auto pb-1">
        <ErrorIcon className="text-red-500" />
        <div className="text-red-500 ml-3">{message}</div>
      </div>
    </>
  );
}
