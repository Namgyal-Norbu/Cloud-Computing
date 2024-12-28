import React from 'react';

const StoredFilesPage = ({ files }) => {
  return (
    <div className="stored-files-page">
      <h2>Stored Files</h2>
      {files.length > 0 ? (
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              <a href={file.url} download={file.name} className="download-link">
                {file.name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No files have been uploaded yet.</p>
      )}
    </div>
  );
};

export default StoredFilesPage;
