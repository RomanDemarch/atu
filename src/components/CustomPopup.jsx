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

export default function CustomPopup({ props, type }) {
  const isLand = type === "land";

  return (
    <div style={{ whiteSpace: "nowrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <div style={{ minWidth: "60px", flexShrink: 0 }}>
          <img
            src={getHeraldryPath(props.OBJECTID)}
            alt="Герб"
            style={{ height: "60px", width: "60px", objectFit: "contain" }}
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
        <div style={{ flex: 1, whiteSpace: "nowrap" }}>
          <div style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#000" }}>
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

      <table
        style={{
          borderCollapse: "collapse",
          marginTop: "8px",
          fontSize: "1rem",
          width: "100%",
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: "1.5em", verticalAlign: "top" }}>
              <img
                src={iconArea}
                style={{
                  width: "1em",
                  height: "1em",
                  objectFit: "contain",
                }}
                alt=""
              />
            </td>
            <td>{formatNumber(props.AREA)} км²</td>
          </tr>
          <tr>
            <td style={{ width: "1.5em", verticalAlign: "top" }}>
              <img
                src={iconPopulation}
                style={{
                  width: "1em",
                  height: "1em",
                  objectFit: "contain",
                }}
                alt=""
              />
            </td>
            <td>{formatNumber(props.POPULATION)} чал. (2019)</td>
          </tr>
          <tr>
            <td style={{ width: "1.5em", verticalAlign: "top" }}>
              <img
                src={iconCenter}
                style={{
                  width: "1em",
                  height: "1em",
                  objectFit: "contain",
                }}
                alt=""
              />
            </td>
            <td>{props.CENTER}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "16px", textAlign: "center" }}>
        {isLand ? (
          <button className="show-communes-btn"
      style={{
        padding: "8px 16px",
        border: "2px solid #999",
        borderRadius: "8px",
        backgroundColor: "#fff",
        color: "#999",
        fontWeight: "bold",
        cursor: "pointer"
      }}
          >Грамады | Communes</button>
        ) : (
          <button className="back-to-lands-btn"
      style={{
        padding: "8px 16px",
        border: "2px solid #FF8899",
        borderRadius: "8px",
        backgroundColor: "#fff",
        color: "#FF8899",
        fontWeight: "bold",
        cursor: "pointer"
      }}
          >Да земляў | To lands</button>
        )}
      </div>
    </div>
  );
}
