import React, { useRef, useState } from 'react';

function CodeBlock({ code }) {
  const textAreaRef = useRef(null);
  const [isSolutionVisible, setSolutionVisible] = useState(false);

  function copyToClipboard(e) {
    textAreaRef.current.select();
    document.execCommand('copy');
    e.target.focus();
  }

  return (
    <div>
      <button onClick={() => setSolutionVisible(!isSolutionVisible)}>
        {isSolutionVisible ? 'Hide Solution' : 'Show Solution'}
      </button>
      {isSolutionVisible && (
        <div>
          <button onClick={copyToClipboard}>Copy</button>
          <pre>
            <code>
              <textarea ref={textAreaRef} value={code} readOnly />
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}

export default CodeBlock;