import { useEffect, useState } from "react";

interface DirEntry {
  /** The name of the entry (file name with extension or directory name). */
  name: string;
  /** Specifies whether this entry is a directory or not. */
  isDirectory: boolean;
  /** Specifies whether this entry is a file or not. */
  isFile: boolean;
  /** Specifies whether this entry is a symlink or not. */
  isSymlink?: boolean;
}

export const Explorer = ({
  rootPath,
  readDir,
}: {
  rootPath: string;
  readDir: (path: string) => Promise<DirEntry[]>;
  isRoot?: boolean;
  name: string;
}) => {
  const [contents, setContents] = useState<DirEntry[]>([]);

  const getDirectoryContents = async () => {
    try {
      const contents = await readDir(rootPath);
      setContents(contents);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getDirectoryContents();
  }, []);

  return (
    <div>
      {contents.map((entry, index) => (
        <div key={index}>
          {entry.isDirectory ? (
            <div className="">
              <Directory
                name={entry.name}
                path={`${rootPath}/${entry.name}`}
                readDir={readDir}
              />
            </div>
          ) : (
            <File name={entry.name} />
          )}
        </div>
      ))}
    </div>
  );
};

const Directory = ({
  name,
  readDir,
  path,
}: {
  path: string;
  name: string;
  readDir: (path: string) => Promise<DirEntry[]>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="">
      <div
        className="p-1 space-x-1 hover:cursor-pointer hover:bg-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fa-solid fa-folder"></i>
        <span>{name}</span>
      </div>
      <div className="ml-4">
        {isOpen && <Explorer name={name} rootPath={path} readDir={readDir} />}
      </div>
    </div>
  );
};

const File = ({ name }: { name: string }) => {
  return (
    <div className="p-1 space-x-1">
      <i className="fa-solid fa-file"></i>
      <span>{name}</span>
    </div>
  );
};
