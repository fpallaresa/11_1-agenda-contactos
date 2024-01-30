import React from "react";
import "./AgendaItem.css";

const AgendaItem = (props) => {

  return (
    <div className="contact-item" key={props.agenda.id}>
      <img className="contact-item__image" src={props.agenda.imageUrl} alt={props.agenda.name} />
      <div className="contact-item__info">
        <p className="contact-item__name">{props.agenda.name} {props.agenda.surname}</p>
        <p className="contact-item__phone">{props.agenda.phone}</p>
        <button className="contact-item__delete-button" onClick={() => props.deleteItem(props.agenda)}>ELIMINAR</button>
      </div>
    </div>
  );
}

const AgendaItemMemo = React.memo(AgendaItem);

export default AgendaItemMemo;