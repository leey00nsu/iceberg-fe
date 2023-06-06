import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useState, useEffect } from "react";
import axios from "axios";
import { useGithubAuthStore } from "../../store/auth";
import { Base64 } from "js-base64";

interface ReadMeProps {
  selectedRepository: string;
}

const ReadMe = (props: ReadMeProps) => {
  const githubAuthStore = useGithubAuthStore();

  const [readme, setReadme] = useState("");

  const getReadMe = async () => {
    const data = await axios.get(
      `https://api.github.com/repos/${githubAuthStore.userName}/${props.selectedRepository}/readme`
    );

    // readme 데이터는 base64로 인코딩 되어있으므로 , 디코딩해줍니다.
    setReadme(Base64.decode(data.data.content));
  };

  useEffect(() => {
    getReadMe();
  }, []);

  return (
    <div className="w-full markdown-body">
      <label className="label">
        <span className="label-text">프로젝트 소개</span>
      </label>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        children={readme}
        remarkPlugins={[remarkGfm]}
      />
    </div>
  );
};

export default ReadMe;