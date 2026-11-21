import TaskBoard from "../components/task-board";

export default function Page() {
  return (
    <main>
      <header className="hero">
        <div className="eyebrow">LEARNING / WEB DEVELOPMENT</div>
        <h1>Task Board<span>.</span></h1>
        <p>考える。つくる。ひとつずつ進める。</p>
        <p className="demo-note">架空のデータを使った学習用デモです。保存内容はサーバーの再起動で初期化されます。</p>
      </header>
      <TaskBoard />
      <footer>TypeScript · React · Next.js <span>小さな実装から、Web開発を学ぶ。</span></footer>
    </main>
  );
}
