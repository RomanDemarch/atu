
import React from "react";
import iconArea from "../assets/icons/area.png";
import iconPopulation from "../assets/icons/population.png";
import iconCenter from "../assets/icons/center.png";

// Используется с ReactDOMServer — никаких onClick, только чистый HTML
export default function CustomPopup({ props, type }) {
  const isLand = type === "land";
  const buttonHtml = isLand
    ? `<button style='margin-top: 5px; padding: 3px 6px; border: 1px solid #ccc; border-radius: 5px'
         onclick="window.dispatchEvent(new CustomEvent('showCommunes', { detail: { landId: ${props.OBJECTID} } }))">
         Показать общины
       </button>`
    : `<button style='margin-top: 5px; padding: 3px 6px; border: 1px solid #ccc; border-radius: 5px'
         onclick="window.dispatchEvent(new CustomEvent('backToLands'))">
         Вернуться к землям
       </button>`;

  return (
    <div style={{ whiteSpace: "nowrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src="${props.heraldry}" alt="Герб" style="height:40px; width:40px;" />
        <div>
          <div style="font-weight: bold; font-size: 1.1rem; color: #000;">
            ${props.NAMEOBJBEL}
          </div>
          <div style="font-style: italic; color: #555;">
            ${props.NAMEOBJECT}
          </div>
          <div style="font-style: italic; color: #555;">
            ${props.NAMEOBJENG}
          </div>
        </div>
      </div>
      <hr/>
      <table style="border-collapse: collapse; margin-top: 8px;">
        <tbody>
          <tr>
            <td><img src="${iconArea}" style="height: 1em; margin-right: 6px;" /></td>
            <td>${props.AREA.toLocaleString('ru-RU')} км²</td>
          </tr>
          <tr>
            <td><img src="${iconPopulation}" style="height: 1em; margin-right: 6px;" /></td>
            <td>${props.POPULATION.toLocaleString('ru-RU')} чел.</td>
          </tr>
          <tr>
            <td><img src="${iconCenter}" style="height: 1em; margin-right: 6px;" /></td>
            <td>${props.CENTER}</td>
          </tr>
        </tbody>
      </table>
      <div dangerouslySetInnerHTML={{ __html: buttonHtml }} />
    </div>
  );
}
