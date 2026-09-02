const api = window.taskmaster

export default function TitleBar({ title }) {
  return (
    <div className="titlebar">
      <div className="titlebar-logo">
        <div className="titlebar-logo-icon">✓</div>
        <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '-0.01em' }}>TaskMaster</span>
      </div>
      <span className="titlebar-title">{title}</span>
      <div className="titlebar-controls">
        <button
          id="btn-minimize"
          className="titlebar-btn titlebar-btn--min"
          onClick={() => api.minimizeWindow()}
          title="Minimize"
        />
        <button
          id="btn-maximize"
          className="titlebar-btn titlebar-btn--max"
          onClick={() => api.maximizeWindow()}
          title="Maximize"
        />
        <button
          id="btn-close"
          className="titlebar-btn titlebar-btn--close"
          onClick={() => api.closeWindow()}
          title="Close"
        />
      </div>
    </div>
  )
}
