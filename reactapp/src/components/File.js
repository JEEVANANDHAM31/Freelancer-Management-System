import React from 'react';

const File = ({ file }) => {
  return (
    <div>
      <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">{file.fileName}</a>
    </div>
  );
};

export default File;
