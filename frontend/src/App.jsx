import Widget from './Widget'

export default function App() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Widget onAddTask={() => console.log('open form')} />
    </div>
  )
}
