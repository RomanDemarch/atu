import React from "react";
import iconArea from "../assets/icons/area.png";
import iconPopulation from "../assets/icons/population.png";
import iconCenter from "../assets/icons/center.png";

// Функция для загрузки герба по OBJECTID
const getHeraldryPath = (objectId) =>
  new URL(`../assets/heraldry/${objectId}.png`, import.meta.url).href;

const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export default function CustomPopup({ props, type, onShowCommunes }) {
  const isLand = type === "land";

  const handleClick = () => {
  window.dispatchEvent(
    new CustomEvent(isLand ? "showCommunes" : "backToLands", {
      detail: { landId: props.OBJECTID }
    })
  );
  document.querySelector(".leaflet-popup-close-button")?.click();
};

  return (
    <div style={{ whiteSpace: "nowrap"}}>
      {/* Заголовок с гербом слева */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ minWidth: "50px", flexShrink: 0 }}>
          <img
            src={getHeraldryPath(props.OBJECTID)}
            alt="Герб"
            style={{ height: "50px", width: "50px", objectFit: "contain" }}
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
        <div style={{ flex: 1, whiteSpace: "nowrap"}}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              color: "#000",
            }}
          >
            {props.NAMEOBJBEL}
          </div>
          <div style={{ fontStyle: "italic", fontSize: "1.1rem", color: "#555" }}>
            {props.NAMEOBJECT}
          </div>
          <div style={{ fontStyle: "italic", fontSize: "1.1rem", color: "#555" }}>
            {props.NAMEOBJENG}
          </div>
        </div>
      </div>

      <hr />

      {/* Таблица с иконками */}
      <table
        style={{
          borderCollapse: "collapse",
          marginTop: "8px",
          fontSize: "1rem",
        }}
      >
        <tbody>
          <tr>
            <td>
              <img
                src={iconArea}
                style={{
                  height: "1em",
                  verticalAlign: "middle",
                  marginRight: "6px",
                }}
              />
            </td>
            <td>{formatNumber(props.AREA)} км²</td>
          </tr>
          <tr>
            <td>
              <img
                src={iconPopulation}
                style={{
                  height: "1em",
                  verticalAlign: "middle",
                  marginRight: "6px",
                }}
              />
            </td>
            <td>{formatNumber(props.POPULATION)} чел.</td>
          </tr>
          <tr>
            <td>
              <img
                src={iconCenter}
                style={{
                  height: "1em",
                  verticalAlign: "middle",
                  marginRight: "6px",
                }}
              />
            </td>
            <td>{props.CENTER}</td>
          </tr>
        </tbody>
      </table>

      {/* Кнопка */}
<button onClick={() => {
  if (isLand) {
    window.dispatchEvent(new CustomEvent("showCommunes", {
      detail: { landId: props.OBJECTID, bounds: layer.getBounds() }
    }));
  } else {
    window.dispatchEvent(new CustomEvent("backToLands"));
  }
}}>
        {isLand ? "Показать общины" : "Вернуться к землям"}
      </button>
    </div>
  );
}
