import React from 'react';

const FileManagement = ({ files }) => {
  if (!files || files.length === 0) {
    return <p>No files available. Start by uploading one!</p>;
  }

  return (
    <section>
      <h2>Manage Your Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            <p>
              <strong>File Name:</strong> {file.filename}
            </p>
            <p>
              <strong>Uploaded On:</strong> {new Date(file.uploadTimestamp.toDate()).toLocaleString()}
            </p>
            <p>
              <strong>Encrypted:</strong> Yes
            </p>
            {file.url && (
              <a href={file.url} download={file.filename}>
                <button>Download</button>
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FileManagement;
