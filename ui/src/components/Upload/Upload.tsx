import React, { ChangeEvent,useEffect, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

interface IProps {
  setFile: Function;
  defaultFile?: string;
}

const Upload: React.FC<IProps> = ({ setFile,defaultFile}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const backend = process.env.REACT_APP_BACKEND;

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }

    const selectFile = event.target.files[0];
    setFile(selectFile);

    const file = URL.createObjectURL(selectFile);
    setSelectedFile(file);
  };

  useEffect(() => {
    if(defaultFile){
      setSelectedFile(backend+defaultFile);
    }
  },[defaultFile])

  return (
    <div className="h-auto relative cursor-pointer">
      {selectedFile ? (
        <img
          src={selectedFile}
          alt="Team Logo"
          className="rounded-full w-20 h-20 object-cover border-slate-600 border cursor-pointer"
        />
      ) : (
        <div className="flex justify-center items-center w-20 h-20 rounded-full border-2 border-slate-700 border-dashed hover:bg-slate-100 cursor-pointer hover:border-solid transition-all">
          <span className="flex flex-col items-center">
            <FiUploadCloud size={"2em"} />
            <span className="font-bold text-xs">Upload</span>
          </span>
        </div>
      )}

      <input
        type={"file"}
        name="theFiles"
        onChange={handleChangeFile}
        className="absolute cursor-pointer left-0 top-0 w-20 h-20 opacity-0"
      />
    </div>
  );
};

export default Upload;
