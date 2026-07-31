import Markdown from "react-markdown";
import { LLM_INSTRUCTIONS } from "../util/llms";

export function LlmInstructions() {
  return (
    <div className="llms" aria-hidden="true">
      <Markdown>
        {LLM_INSTRUCTIONS}
      </Markdown>
    </div>
  )
}
