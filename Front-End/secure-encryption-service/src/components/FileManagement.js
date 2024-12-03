import React from 'react';

const FileManagement = ({ files }) => {
  return (
    <section>
      <h2>Manage Your Files</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.name} - Encrypted</li>
        ))}
      </ul>
    </section>
  );
};

export default FileManagement;
