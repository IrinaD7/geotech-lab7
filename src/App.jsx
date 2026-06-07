import { Map } from "./components/Map";

function App() {
  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          height: "50px",
          margin: "20px 0",
        }}
      >
        <h3>Лабораторная работа №7</h3>
        <h1 style={{ textAlign: "center" }}>Рязань</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <span>ПРИ-123</span>
          <span>Димакова Ирина</span>
        </div>
      </header>
      <hr style={{ margin: "20px 0" }} />

      <div style={{ width: "100%", height: "600px" }}>
        <Map />
      </div>
    </>
  );
}

export default App;
