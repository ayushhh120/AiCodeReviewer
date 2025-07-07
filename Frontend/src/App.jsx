import { useState , useEffect, useRef} from 'react'
import "prismjs/themes/prism-tomorrow.css"
import prism from 'prismjs'
import Editor from 'react-simple-code-editor'
import './App.css'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import "highlight.js/styles/github-dark.css"
import axios from 'axios'

function App() {
const [review, setReview] = useState("")
const [loading, setLoading] = useState(false);

const textareaRef = useRef(null);
const [editorHeight, setEditorHeight] = useState("100%");

const [code, setCode] = useState(``)  

useEffect(() => {
  if (textareaRef.current) {
    const el = textareaRef.current;
    // check if content overflows
    if (el.scrollHeight > el.offsetHeight) {
      setEditorHeight("auto");
    } else {
      setEditorHeight("100%");
    }
  }
}, [code])

  
useEffect(() => {
    prism.highlightAll();
  },[])
  
async function reviewCode(){
  if (code.trim() === "") {
    setReview(""); // Optionally show a message or do nothing
    return;
  }
  setLoading(true);
  setReview(""); // Clear previous review while loading
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/get-review`, { code });

    if (response && response.data) {
      setReview(response.data);
    } else {
      setReview("No response from server.");
    }
  } catch (error) {
    console.error('Error reviewing code:', error);
    setReview("Error reviewing code. Please try again.");
  }
  setLoading(false);
}

function clearResponse() {
  setReview("");
}

return(
  <>
    <main>
      <div className="left">
        <div className="code" style={{position: "relative"}}>
          {code.trim() === "" && !loading && (
            <div className="empty-message">
              Hi, give your code here to review :)
            </div>
          )}
          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => prism.highlight(code, prism.languages.javascript, 'javascript')}
            padding={10}
            textareaRef={textareaRef} 
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              color: '#f8f8f2',
              // border: "1px solid #ddd",
              borderRadius: "2px",
              height:  editorHeight, 
              width: "100%",
              overflow: "auto",
              
             
            }}
          />
        </div>
        <button
          onClick={reviewCode}
          className='review'
          disabled={loading}
        >
          Review
        </button>
      </div>

      <div className="right">
        <div className="reviewContainer">
          {loading ? (
            <div className="loading-effect">
              <span className="dot-flashing"></span>
              <span style={{marginLeft: 12}}>Please wait reviewing code...</span>
            </div>
          ) : (
            <>
              <Markdown rehypePlugins={[rehypeHighlight]}>
                {review}
              </Markdown>
              <button
                onClick={clearResponse}
                className='clear'>
                Clear
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  </>
)
}




export default App
